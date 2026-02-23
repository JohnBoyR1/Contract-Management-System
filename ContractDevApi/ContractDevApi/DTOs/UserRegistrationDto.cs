using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json.Nodes;
using ContractDevApi.Models;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //Registration DTO consists of expected properties from Front-End
    //DTO is used to construct both a new User and their associative Profile
    //ComparePassword uses DataAnnotations - Compare attribute to ensure that this model validates that both Password and ConfirmPassword contain the same string value
    //-----------------------
    public class UserRegistrationDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public string Country { get; set; } = string.Empty;

        [Required]
        public string UserTitle { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        public string SecurityQuestion { get; set; } = string.Empty;

        [Required]
        public string SecurityAnswer { get; set; } = string.Empty;
    }
}
