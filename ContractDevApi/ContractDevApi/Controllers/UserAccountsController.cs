using System.ComponentModel;
using System.Security.Claims;
using ContractDevApi.DTOs;
using ContractDevApi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ContractDevApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserAccountsController : ControllerBase
    {
        private readonly ContractDevContext _context;

        public UserAccountsController(ContractDevContext context)
        {
            _context = context;
        }

        // GET: api/UserAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAccount>>> GetUserAccounts()
        {
            return await _context.UserAccounts.ToListAsync();
        }

        // GET: api/UserAccounts/Username
        [HttpGet("User/{username}")]
        public async Task<ActionResult<UserAccount>> GetUserAccount(string username)
        {
            //Check if user with email exists
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.Username.Trim().ToLower() == username.Trim().ToLower());

            if (user == null)
            {
                return NotFound();
            }

            var response = new UserResponseDto
            {
                Id = user.UserAccountId,
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };

            return Ok(new
            {
                Message = $"Data for {username}",
                Data = response
            });
        }


        // POST: api/UserAccounts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("Account/Register")]
        public async Task<ActionResult<UserAccount>> RegisterUserAccount(UserRegistrationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest("Passwords do not match");

            bool userExists = await _context.UserAccounts.AnyAsync(x => x.Email!.ToLower() == dto.Email!.ToLower() || x.Username!.ToLower() == dto.Username!.ToLower());

            if (userExists) return Conflict("User with that email or username already exists");

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new UserAccount
            {
                Username = dto.Username,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Country = dto.Country,
                Email = dto.Email,
                PasswordHash = passwordHash
            };

            _context.UserAccounts.Add(user);
            int result = await _context.SaveChangesAsync();

            if (result <= 0) return Problem("System error occured. User Registration Failed.");

            var response = new UserResponseDto
            {
                Id = user.UserAccountId,
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
            };

            return Ok(new
            {
                Message = "User Registration Successful",
                data = response
            });

        }

        [HttpPost("Account/Login")]
        public async Task<IActionResult> Login(UserLoginDto dto)
        {
            //Determine if user is currently logged into an account, if so log them out
            if (IsAuthenticated()) await Logout();

            //Check if user with email exists
            var user = await _context.UserAccounts.FirstOrDefaultAsync(x => x.Email!.ToLower() == dto.Email!.ToLower());

            //If email does not exist in UserAccounts table, return error
            if (user == null) return Unauthorized(new { Message = "Invalid email or password" });

            //Check if password matches hashed password via BCrypt verification
            bool validatePassword = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            //If password does not pass verification, return error
            if (!validatePassword) return Unauthorized(new { Message = "Invalid email or password" });

            //Construct response entity
            var response = new UserResponseDto
            {
                Id = user.UserAccountId,
                Username = user.Username,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName
            };

            //Generate authentication cookie with a claim for the user
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserAccountId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            //Assign cookie to session - cookie authentication expires in 1 hour (range can vary)
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            //Valid login, return response enttiy
            return Ok(new
            {
                Message = "Login Successful",
                Data = response
            });
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


        private bool IsAuthenticated()
        {
            return HttpContext.User.Identity?.IsAuthenticated == true;
        }

        //TODO
        // DELETE: api/UserAccounts/5

    }
}
