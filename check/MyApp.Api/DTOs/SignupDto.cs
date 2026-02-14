//DTOs (Data Transfer Objects)
using Microsoft.AspNetCore.SignalR;

namespace MyApp.Api.DTOs;

public class SignupDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; } 
    public required string Country { get; set; }
    
}
/* Why this is good
    Uses required for essential fields
    Accepts a plain password (you will hash it in the controller)
    Does NOT expose PasswordHash
*/