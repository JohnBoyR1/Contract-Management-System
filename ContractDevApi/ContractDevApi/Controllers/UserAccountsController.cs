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


        public UserAccountsController(ContractDevContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // GET: api/UserAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAccount>>> GetUserAccounts()
        {
            return await _context.UserAccounts.ToListAsync();
        }

        // POST: api/UserAccounts/Register
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //-----------------------
        //New user registration - information received from Front-End used to populate User and Profile table
        //-----------------------
        [HttpPost("Register")]
        public async Task<ActionResult<UserAccount>> RegisterUserAccount(UserRegistrationDto dto)
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
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            //Checks UserLoginDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Determine if user is currently logged into an account, if so log them out - will deauthorize cookie from previous login, JWT cannot be revoked - expires after 1 hour of initial authentication
            if (IsAuthenticated()) await Logout();

            //Check if user with email exists
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            //If email does not exist in UserAccounts table, return error Status 401
            if (user == null) return Unauthorized(new { Message = "Invalid email or password" });

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            //If password does not pass verification, return error Status 401
            if (!validatePassword) return Unauthorized(new { Message = "Invalid email or password" });

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == user.UserAccountId);

            //Generate authentication cookie with a claim for the user
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserAccountId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{userProfile.FirstName} {userProfile.LastName}")
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            //Assign cookie to session - cookie authentication expires in 1 hour (range can vary)
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            //Construct response entity
            var response = new UserResponseDto
            {
                UserId = user.UserAccountId,
                Email = user.Email,
                Username = userProfile.Username,
                FirstName = userProfile.FirstName,
                LastName = userProfile.LastName
            };

            var token = _jwt.GenerateToken(response);

            //Valid login, return token enttiy
            return Ok(new { token });
        }


        //-----------------------
        //Logout - Deauthorizes cookie associated to current user
        //Cannot deauthorize JWT - JWT current lifetime is 1 hour
        //-----------------------
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            //if (HttpContext.User.Identity?.IsAuthenticated == false) return BadRequest(new { Message = "No user is logged in" });

             if (!IsAuthenticated()) return BadRequest(new { Message = "No user is logged in" });

            //Remove cookie from session
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            //Return Status 200 OK
            //NOTE: can send redirect post to return user to home page: return Redirect("~/");
            return Ok(new
            {
                Message = "User logged out"
            });
        }

        //-----------------------
        //Change Password - Receives id, old password, new password, and confirm new password from Front-End
        //Ensures that both JWT and cookie are authenticated before updating user password
        //id is used to find user, old password is verified, new password is hashed and overwrites old password
        //-----------------------
        [Authorize]
        [HttpPost("ChangePassword/{id}")]
        public async Task<IActionResult> ChangePassword(int id, UserPasswordDto dto)
        {
            //Checks UserPasswordDto Model to ensure that all incoming values match the Model constraints
            if (!ModelState.IsValid) return ValidationProblem(ModelState);
            //Check that current session is authenticated via cookie, [Authorize] attribute checks JWT
            if (!IsAuthenticated()) return BadRequest(new { Message = "User not authenticated" });

            //Retrieve user details from context based on UserAccountId
            var user = await _context.UserAccounts.FindAsync(id);

            //
            if (user == null) return NotFound($"User with id: {id} does not exist");

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

            return Ok(new { message = "Password updated successfully" });
        }

        //Placeholder validation - Front-End expects it. Actual validation of token uses [Authorize] attribute
        //Note to Front-End: Front-End should assume accounts are validated until HTTP request response returns Status 401 - UnAuthorized
        [HttpGet("Validate")]
        public async Task<IActionResult> ValidateToken()
        {
            return Ok(new { message = "Token Valid" });
        }

        //Checks if Cookie is properly authenticated
        private bool IsAuthenticated()
        {
            return HttpContext.User.Identity?.IsAuthenticated == true;
        }

        //TODO
        // DELETE: api/UserAccounts/5

    }
}
