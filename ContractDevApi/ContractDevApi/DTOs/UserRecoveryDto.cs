using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    public class UserRecoveryDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string SecurityQuestion { get; set; } = string.Empty;

        [Required]
        public string SecurityAnswer { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }
}
