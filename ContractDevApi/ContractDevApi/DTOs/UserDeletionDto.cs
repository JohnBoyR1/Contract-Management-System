using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    public class UserDeletionDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
