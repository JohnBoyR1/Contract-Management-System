using System.ComponentModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using ContractDevApi.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

        private readonly JwtService _jwt;   // <-- Inject JWT service


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

        // POST: api/UserAccounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Register")]
        public async Task<ActionResult<UserAccount>> RegisterUserAccount(UserRegistrationDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            bool emailExists = await _context.UserAccounts.AnyAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            if (emailExists) return Conflict("User with that email or username already exists");

            bool usernameExists = await _context.UserProfiles.AnyAsync(x => x.Username!.ToLower() == dto.Username!.ToLower());

            if (usernameExists) return Conflict("user with that email or username already exists");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new UserAccount
            {
                Email = dto.Email,
                PasswordHash = passwordHash
            };

            _context.UserAccounts.Add(user);

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

            _context.UserProfiles.Add(profile);

            int result = await _context.SaveChangesAsync();

            if (result <= 0) return Problem("System error occured. User Registration Failed.");

            return Ok(new
            {
                Message = "User Registration Successful",
                user.UserAccountId
            });

        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            //Determine if user is currently logged into an account, if so log them out
            //if (IsAuthenticated()) await Logout();

            //Check if user with email exists
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            //If email does not exist in UserAccounts table, return error
            if (user == null) return Unauthorized(new { Message = "Invalid email or password" });

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            //If password does not pass verification, return error
            if (!validatePassword) return Unauthorized(new { Message = "Invalid email or password" });

            var userProfile = await _context.UserProfiles.FirstOrDefaultAsync(x => x.UserAccountId == user.UserAccountId);

            ////Generate authentication cookie with a claim for the user
            //var claims = new[]
            //{
            //    new Claim(ClaimTypes.NameIdentifier, user.UserAccountId.ToString()),
            //    new Claim(ClaimTypes.Email, user.Email),
            //    new Claim(ClaimTypes.Name, $"{userProfile.FirstName} {userProfile.LastName}")
            //};
            //var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            //var principal = new ClaimsPrincipal(identity);

            ////Assign cookie to session - cookie authentication expires in 1 hour (range can vary)
            //await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

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

        [HttpPost("Account/Logout")]
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

        //TODO
        // PUT: api/UserAccounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id)
        {


            return Ok();
        }

        [HttpGet("Validate")]
        public async Task<IActionResult> ValidateToken()
        {
            return Ok(new { message = "Token Valid" });
        }

        private bool IsAuthenticated()
        {
            return HttpContext.User.Identity?.IsAuthenticated == true;
        }

        //TODO
        // DELETE: api/UserAccounts/5

    }
}
