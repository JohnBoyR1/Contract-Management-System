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

        // GET: api/UserAccounts
        // Returns all user accounts - should be restricted to admin users in production
        //[Authorize] // Require authentication
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<UserAccount>>> GetUserAccounts()
        //{
        //    //In production we may want to consider only allowing admins to retrieve all user accounts
        //    //Ex: if (!User.IsInRole("Admin")) return Forbid();

        //    return await _context.UserAccounts.ToListAsync();
        //}

        // GET: api/UserAccounts/{id}
        // Get a specific user's account - users can only view their own account
        //[Authorize]
        //[HttpGet("{id}")]
        //public async Task<ActionResult<UserAccount>> GetUserAccount(int id)
        //{
        //    //Verify the authenticated user is requesting their own data
        //    if (!IsAuthorizedUser(id))
        //    {
        //        return Forbid(); // 403 Forbidden
        //    }

        //    var userAccount = await _context.UserAccounts.FindAsync(id);

        //    if (userAccount == null)
        //    {
        //        return NotFound();
        //    }

        //    return userAccount;
        //}

        // POST: api/UserAccounts/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //-----------------------
        //New user registration - information received from Front-End used to populate User and Profile table
        //-----------------------
        [HttpPost("Register")]
        public async Task<ActionResult<UserAccount>> RegisterUserAccount([FromForm] UserRegistrationDto dto)
        {
            //Checks UserAccount Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //emailExists & usernameExists ensure that new account details do not conflict with unique user properties
            bool emailExists = await _context.UserAccounts.AnyAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            if (emailExists) return Conflict("User with that email or username already exists");

            bool usernameExists = await _context.UserProfiles.AnyAsync(x => x.Username!.ToLower() == dto.Username!.ToLower());

            if (usernameExists) return Conflict("user with that email or username already exists");

            //BCrypt hashing used to hash user password that will be saved on the database
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            //Constructing UserAccount Entity
            var user = new UserAccount
            {
                Email = dto.Email,
                PasswordHash = passwordHash
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
                Description = dto.Description,
                UserAccountId = user.UserAccountId,
                UserAccount = user
            };

            //Adding UserProfile Entity to in-memory database context
            _context.UserProfiles.Add(profile);

            //Saving changes to physical database - result stores integer value of status received from database
            int result = await _context.SaveChangesAsync();

            //If result is 0 or -1 (status codes for system error) sends returns error back to Front-End
            if (result <= 0) return Problem("System error occured. User Registration Failed.");

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
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            //If email does not exist in UserAccounts table, return error Status 401
            if (user == null) return Unauthorized(new { Message = "Invalid email or password" });

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid email or password" });

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == user.UserAccountId);

            // Check if user profile exists
            if (userProfile == null)
            {
                return Problem("User profile not found");
            }

            //Construct response entity
            var response = new UserResponseDto
            {
                UserId = user.UserAccountId,
                Email = user.Email,
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
        //Logout - Deauthorizes cookie associated to current user
        //Cannot deauthorize JWT - JWT current lifetime is 1 hour
        //-----------------------
        //[HttpPost("Logout")]
        //public async Task<IActionResult> Logout()
        //{
        //    //possible solution - add jwt to blacklist on database for duration of jwt expiry
            
        //    return Ok(new
        //    {
        //        Message = "User logged out"
        //    });
        //}

        //-----------------------
        //Change Password - Receives id, old password, new password, and confirm new password from Front-End
        //Ensures JWT is authenticated and user can only change their own password
        //id is used to find user, old password is verified, new password is hashed and overwrites old password
        //-----------------------
        [Authorize]
        [HttpPost("ChangePassword")]
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
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.PasswordHash);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid Password" });

            //Hash new password
            var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            //Overrite old hashed password with new password
            user.PasswordHash = newPasswordHash;

            //Saving changes to physical database - result stores integer value of status received from database
            int result = await _context.SaveChangesAsync();

            //If result is 0 or -1 (status codes for system error) sends returns error back to Front-End
            if (result <= 0) return Problem("System error occured. Password Update Failed.");

            return Ok(new { Message = "Password updated successfully" });
        }

        //TODO
        // DELETE: api/UserAccounts/5
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
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid Password" });


            _context.UserAccounts.Remove(userAccount);
            _context.UserProfiles.Remove(userProfile);

            int result = await _context.SaveChangesAsync();

            if (result <= 0) return Problem("System error occured. User Account Deletion Failed.");

            return Ok(new { Message = "Account and Profile successfully deleted"});
        }

        //-----------------------
        //Helper method to retrieve JWT token claim and check if user ID matches JWT sub (user ID)
        //Returns null if claim could not be found or if invalid
        //-----------------------
        private int? GetAuthenticatedUserId()
        {
            //The "sub" (subject) claim contains the user ID
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

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
            //Parse JWT claim to get authenticated user
            var userId = GetAuthenticatedUserId();
            var email = User.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
            var username = User.FindFirst("username")?.Value;

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
    }
}
