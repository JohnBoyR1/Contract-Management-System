using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserProfile
    {
        [Key]
        public int UserProfileId { get; set; }

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

        [Required]
        [Column(TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [StringLength(20)]
        [Phone]
        [Column(TypeName = "varchar(20)")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Bio { get; set; } = string.Empty;

        [Column(TypeName = "boolean")]
        public bool? AvailableForWork { get; set; }

        [Column(TypeName = "boolean")]
        public bool? OfferingWork { get; set; }

        [Column(TypeName = "boolean")]
        public bool? DisplayUserName { get; set; }

        [Column(TypeName = "boolean")]
        public bool? HidePhoneNumber { get; set; }

        public int UserAccountId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }
    }
}
