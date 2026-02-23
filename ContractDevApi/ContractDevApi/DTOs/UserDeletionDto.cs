using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    public class UserDeletionDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;

        [Required]
        public string SecurityAnswer { get; set; } = string.Empty;
    }
}
