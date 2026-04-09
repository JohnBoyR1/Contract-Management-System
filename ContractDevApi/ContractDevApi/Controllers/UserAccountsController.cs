using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using ContractDevApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountsController : ControllerBase
    {
        private readonly ContractDevContext _context;

        private readonly JwtService _jwt;

        //Controller Constructor, builds inmemory database context and JWT token service
        public UserAccountsController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // POST: api/UserAccounts/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //-----------------------
        //New user registration - information received from Front-End used to populate User and Profile table
        //-----------------------
        [HttpPost("Register")]
        public async Task<ActionResult> RegisterUserAccount([FromForm] UserRegistrationDto dto)
        {
            //Checks UserAccount Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //emailExists & usernameExists ensure that new account details do not conflict with unique user properties
            bool emailExists = await _context.UserAccounts.AnyAsync(x => x.UserSignupEmail! == dto.Email!.ToLower());

            if (emailExists) return Conflict("User with that email or username already exists");

            bool usernameExists = await _context.UserProfiles.AnyAsync(x => x.Username!.ToLower() == dto.Username!.ToLower());

            if (usernameExists) return Conflict("user with that email or username already exists");

            //BCrypt hashing used to hash user password that will be saved on the database
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            string hashedSecurityAnswer = BCrypt.Net.BCrypt.HashPassword(dto.SecurityAnswer.ToLower());

            //Constructing UserAccount Entity
            var user = new UserAccount
            {
                UserSignupEmail = dto.Email.ToLower(),
                HashedPassword = hashedPassword,
                SecurityQuestion = dto.SecurityQuestion,
                SecurityAnswer = hashedSecurityAnswer
            };

            //Adding UserAccount Entity to in-memory database context
            _context.UserAccounts.Add(user);

            //Constructing UserProfile Entity
            var profile = new UserProfile
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Country = dto.Country,
                Bio = "",
                PhoneNumber = "",
                Description = dto.Description,
                UserTitle = "New User",
                AvailableForWork = false,
                OfferingWork = false,
                LastLogin = DateTimeOffset.UtcNow,
                UsernameDisplay = false,
                HidePhoneNumber = false,
                UserAccountId = user.UserAccountId,
                UserAccount = user
            };

            //Adding UserProfile Entity to in-memory database context
            _context.UserProfiles.Add(profile);

            var socials = new SocialConnection
            {
                UserAccountId = user.UserAccountId,
                FacebookLink = "",
                UserSocialEmailLink = "",
                XLink = "",
                GithubLink = "",
                LinkedinLink = "",
                UserAccount = user
            };

            _context.SocialConnections.Add(socials);

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. User Profile Update Failed."+e.Message);
            }


            //if all above is successful - return HTTP Status 200, Message, and UserAccountId as latter is expected in Front-End
            return Ok(new
            {
                Message = "User Registration Successful",
                user.UserAccountId
            });

        }

        //-----------------------
        //Login - receives email and password from Front-End, ensures that credentials are accurate and applies JWT and Cookie authentication
        //-----------------------
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromForm] UserLoginDto dto)
        {
            //Checks UserLoginDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Check if user with email exists
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.UserSignupEmail! == dto.Email!.ToLower());

            //If email does not exist in UserAccounts table, return error Status 401
            if (user == null) return Unauthorized(new { Message = "Invalid email or password" });

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.HashedPassword);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid email or password" });

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == user.UserAccountId);

            // Check if user profile exists
            if (userProfile == null)
            {
                return Problem("User profile not found");
            }

            userProfile.LastLogin = DateTimeOffset.UtcNow;

            await _context.SaveChangesAsync();

            //Construct response entity
            var response = new UserResponseDto
            {
                UserId = user.UserAccountId,
                Email = user.UserSignupEmail,
                Username = userProfile.Username,
                FirstName = userProfile.FirstName,
                LastName = userProfile.LastName
            };
            
            //Generate JWT token claim
            var token = _jwt.GenerateToken(response);

            //Valid login, return token entity
            return Ok(new { token });
        }

        //-----------------------
        //Change Password - Receives id, old password, new password, and confirm new password from Front-End
        //Ensures JWT is authenticated and user can only change their own password
        //id is used to find user, old password is verified, new password is hashed and overwrites old password
        //-----------------------
        [Authorize]
        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromForm] UserPasswordDto dto)
        {
            //Checks UserPasswordDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Get the authenticated user's ID from JWT token claims
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { Message = "Invalid token: User ID not found" });
            }

            //Verify the authenticated user is trying to change their own password
            if (authenticatedUserId.Value != dto.Id)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but not authorized to change another user's password
            }

            //Retrieve user details from context based on UserAccountId
            var user = await _context.UserAccounts.FindAsync(dto.Id);

            if (user == null) return NotFound($"User with id: {dto.Id} does not exist");

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.HashedPassword);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid Password" });

            //Check if Security answer given matches one created at account creation
            bool validateSecurityAnswer = BCrypt.Net.BCrypt.Verify(dto.SecurityAnswer.ToLower(), user.SecurityAnswer);

            if (!validateSecurityAnswer) return Unauthorized(new { Message = "Invalid Security Answer" });
            
            //Hash new password
            var newHashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            //Overrite old hashed password with new password
            user.HashedPassword = newHashedPassword;

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. User Profile Update Failed."+e.Message);
            }


            return Ok(new { Message = "Password updated successfully" });
        }

        // DELETE: api/UserAccounts/Delete
        [Authorize]
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteUser([FromForm] UserDeletionDto dto)
        {
            //Get the authenticated user's ID from JWT token claims
            var authenticatedUserId = GetAuthenticatedUserId();
            if (authenticatedUserId == null)
            {
                return Unauthorized(new { message = "Invalid token: User ID not found" });
            }

            //Verify the authenticated user is trying to delete their own account
            if (authenticatedUserId.Value != dto.Id)
            {
                return Forbid(); // 403 Forbidden - user is authenticated but not authorized to delete another user's account
            }

            //Ensure that user account and profile exist
            var userAccount = await _context.UserAccounts.FirstOrDefaultAsync(x => x.UserAccountId == dto.Id);
            if (userAccount == null) return NotFound("Account Not Found");

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == dto.Id);
            if (userProfile == null) return NotFound("Profile Not Found");

            //Retrieve user details from context based on UserAccountId
            var user = await _context.UserAccounts.FindAsync(dto.Id);

            if (user == null) return NotFound($"User with id: {dto.Id} does not exist");

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.HashedPassword);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid Password" });

            bool validateSecurityAnswer = BCrypt.Net.BCrypt.Verify(dto.SecurityAnswer.ToLower(), user.SecurityAnswer);

            if (!validateSecurityAnswer) return Unauthorized(new { Message = "Invalid Security Answer" });


            _context.UserAccounts.Remove(userAccount);
            _context.UserProfiles.Remove(userProfile);

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. User Profile Update Failed."+e.Message);
            }


            return Ok(new { Message = "Account and Profile successfully deleted"});
        }

        //-----------------------
        //Helper method to retrieve JWT token claim and check if user ID matches JWT sub (user ID)
        //Returns null if claim could not be found or if invalid
        //-----------------------
        private int? GetAuthenticatedUserId()
        {
            //Retrieve current user from http context - bearer token authentication
            var principal = HttpContext?.User;
            if (principal?.Identity?.IsAuthenticated != true)
            {
                return null; //no bearer token is currently provided - return null for user id
            }

            //The "sub" (subject) claim contains the user ID
            var userIdClaim = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                //sub claim not found in token
                return null;
            }

            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }

            //Unable to parse user ID from claim
            return null;
        }

        //-----------------------
        //Placeholder validation for development - Allows for quick checking of validation via Swagger UI. Actual validation of token uses [Authorize] attribute
        //Note to Front-End: Front-End should assume accounts are validated until HTTP request response returns Status 401 - UnAuthorized
        //-----------------------
        [Authorize]
        [HttpGet("Validate")]
        public async Task<IActionResult> ValidateToken()
        {
            var principal = HttpContext?.User;

            //Parse JWT claim to get authenticated user
            var userId = GetAuthenticatedUserId();
            var email = principal?.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            var username = principal?.FindFirst("username")?.Value;

            if (userId == null)
            {
                //If claim is null return Error 401 - Unauthorized
                return Unauthorized(new { message = "Invalid token" });
            }

            //Returns user details from endpoint
            return Ok(new 
            { 
                message = "Token Valid",
                userId,
                email,
                username
            });
        }

        //-----------------------
        //Helper method that checks if requested user ID matches the current authenticated user
        //Method is used in endpoints where user is attempting to access their own data
        //-----------------------
        //private bool IsAuthorizedUser(int requestedUserId)
        //{
        //    var authenticatedUserId = GetAuthenticatedUserId();
        //    return authenticatedUserId.HasValue && authenticatedUserId.Value == requestedUserId;
        //}
        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Jeán input for password recovery----------------

        [HttpPost("RecoverAccount")]
        public async Task<IActionResult> RecoverAccount([FromForm] UserRecoveryDto dto)
        {
            // Validate incoming model
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            // Find user by email
            var user = await _context.UserAccounts
                .FirstOrDefaultAsync(u => u.UserSignupEmail == dto.Email.ToLower());

            if (user == null)
                return NotFound(new { Message = "No account found with that email." });

            // Validate security question
            if (user.SecurityQuestion != dto.SecurityQuestion)
                return Unauthorized(new { Message = "Incorrect security question." });

            // Validate security answer (hashed)
            bool answerMatches = BCrypt.Net.BCrypt.Verify(
                dto.SecurityAnswer.ToLower(),
                user.SecurityAnswer
            );

            if (!answerMatches)
                return Unauthorized(new { Message = "Incorrect security answer." });

            // Hash new password
            string newHashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            // Update password
            user.HashedPassword = newHashedPassword;

            int result = await _context.SaveChangesAsync();

            if (result <= 0)
                return Problem("System error occurred. Password update failed.");

            return Ok(new { Message = "Password reset successfully." });
        }*/

        [HttpPost("RecoverAccount")]
        public async Task<IActionResult> RecoveryAccount([FromForm] UserRecoveryDto dto)
        {
            //Checks UserRecoveryDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Ensure that user exists by email
            var userByEmail = await _context.UserAccounts.FirstOrDefaultAsync(x => x.UserSignupEmail == dto.Email);
            if (userByEmail == null) return NotFound("Email not found");

            //Determine that question and answer match selected user
            bool validSecQuestion = userByEmail.SecurityQuestion == dto.SecurityQuestion;
            if (!validSecQuestion) return Unauthorized("Security Question or Security Answer does not match");

            bool validSecAnswer = BCrypt.Net.BCrypt.Verify(dto.SecurityAnswer, userByEmail.SecurityAnswer);
            if (!validSecAnswer) return Unauthorized("Security Question or Security Answer does not match");

            //Valid user data - registering new password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

            userByEmail.HashedPassword = hashedPassword;

            //Try to update database -- if unsuccessful return error
            try {
                await _context.SaveChangesAsync();
            } catch(DbUpdateException e) {
                return Problem("System error occured. User Profile Update Failed."+e.Message);
            }


            return Ok("New password registered successfully.");
        }

    }
}
