using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    public class UserPasswordDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string OldPassword { get; set; } = string.Empty;

        [Required]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;

        [Required]
        public string SecurityAnswer { get; set; } = string.Empty;
    }
}
