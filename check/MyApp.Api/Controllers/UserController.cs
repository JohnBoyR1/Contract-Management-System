using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyApp.Api.Data;
using MyApp.Api.DTOs;
using MyApp.Api.Models;
using MyApp.Api.Services; // for JwtSerives
using System.Security.Cryptography;
using System.Text;

namespace MyApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwt;   // <-- Inject JWT service

    public UsersController(AppDbContext context, JwtService jwt)
    {
        _context = context;
        _jwt = jwt;   // <-- store injected service

    }

    // POST: api/users/signup
    [HttpPost("signup")]
    public async Task<IActionResult> Signup(SignupDto dto)
    {
        // Check if email or username already exists
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email || u.Username == dto.Username))
            return BadRequest("Email or username already exists.");

        // Hash password
        var passwordHash = HashPassword(dto.Password);

        var user = new User
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Username = dto.Username,
            Email = dto.Email,
            Country = dto.Country,
            PasswordHash = passwordHash
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User created successfully", user.UserId });
    }

    // PUT: api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(int id, UpdateProfileDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound("User not found.");

        // Update only fields that were provided
        if (dto.FirstName != null) user.FirstName = dto.FirstName;
        if (dto.LastName != null) user.LastName = dto.LastName;
        if (dto.Username != null) user.Username = dto.Username;
        if (dto.Email != null) user.Email = dto.Email;
        if (dto.PhoneNumber != null) user.PhoneNumber = dto.PhoneNumber;
        if (dto.Country != null) user.Country = dto.Country;
        if (dto.Description != null) user.Description = dto.Description;
        if (dto.Bio != null) user.Bio = dto.Bio;

        if (dto.AvailableForWork.HasValue) user.AvailableForWork = dto.AvailableForWork.Value;
        if (dto.OfferingWork.HasValue) user.OfferingWork = dto.OfferingWork.Value;
        if (dto.DisplayUserName.HasValue) user.DisplayUserName = dto.DisplayUserName.Value;
        if (dto.HidePhoneNumber.HasValue) user.HidePhoneNumber = dto.HidePhoneNumber.Value;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully" });
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

// ---------------------------------------------------------
// POST: api/users/login  (JWT VERSION)
// ---------------------------------------------------------

[HttpPost("login")]
public async Task<IActionResult> Login(LoginDto dto)
{   
    // 1. Look up the user by email
    var user = await _context.Users
        .FirstOrDefaultAsync(user => user.Email == dto.Email);
    
    if (user == null)
        return BadRequest("Invalid email or password");

    //2. Hash the incoming password
    var inPasswordHashed = HashPassword(dto.Password);

    //3. compare the hashed passwords (later we hash)
    if (user.PasswordHash != inPasswordHashed)
        return BadRequest("Invalid email or password");

    // 4. Generate JWT token
    var token = _jwt.GenerateToken(user);

    // 5. Return ONLY the token (not the user object)
        return Ok(new { token });
}

// GET: api/users/{id}
[HttpGet("{id}")]
public async Task<IActionResult> GetUser(int id)
{
    var user = await _context.Users.FindAsync(id);
    if (user == null)
        return NotFound("User not found.");

    return Ok(user);
}
// Get all users in an array
[HttpGet]
public async Task<IActionResult> GetAllUsers()
{
    var users = await _context.Users.ToListAsync();
    return Ok(users);
}

//validating the token 
[HttpGet("validate")]
    public IActionResult ValidateToken()
    {
        return Ok(new { message = "Token valid" });
    }

    

}