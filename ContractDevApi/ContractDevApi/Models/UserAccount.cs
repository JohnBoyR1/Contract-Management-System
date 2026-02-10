using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserAccount
    {

        [Key]
        public int UserAccountId { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Column(TypeName = "varchar(50)")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Column(TypeName = "varchar(100)")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Column(TypeName = "varchar(100)")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(2, MinimumLength = 2)]
        [Column(TypeName = "varchar(2)")]
        public string Country { get; set; } = string.Empty;

        //Email does not need mimimum length here as DTO will ensure email validation
        [Required]
        [StringLength(255)]
        [Column(TypeName = "varchar(255)")]
        public string Email { get; set; } = string.Empty;

        //Hashed
        [Required]
        [StringLength(255)]
        [Column(TypeName = "varchar(255)")]
        public string PasswordHash { get; set; } = string.Empty;

        [Column(TypeName = "boolean")]
        public bool Is2faEnabled { get; set; } = false;

        //Stored Encryoted TOTP secret
        [Column(TypeName = "text")]
        public string EncryptedTOTPSecret { get; set; } = string.Empty;

        //Hashed
        [Column(TypeName = "JSONB")]
        public List<string> RecoveryCodesHash { get; set; } = new List<string>();
    }
}
