using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace ContractDevApi.Models
{
    //-----------------------
    //UserProfile model - if no model exists on the database, ef database update will create table via Entity Framework
    //-----------------------
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
        [Column(TypeName = "varchar(30)")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Column(TypeName = "varchar(30)")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [StringLength(2, MinimumLength = 2)]
        [Column(TypeName = "varchar(2)")]
        public string Country { get; set; } = string.Empty;

        [Column(TypeName = "varchar(255)")]
        public string Bio { get; set; } = string.Empty;

        [StringLength(15)]
        [Phone]
        [Column(TypeName = "varchar(20)")]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(20)")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "varchar(50)")]
        public string UserTitle { get; set; } = string.Empty;
        
        [Column(TypeName = "boolean")]
        public bool? AvailableForWork { get; set; }

        [Column(TypeName = "boolean")]
        public bool? OfferingWork { get; set; }

        public DateTimeOffset? LastLogin { get; set; }

        [Column(TypeName = "boolean")]
        public bool? UsernameDisplay { get; set; }

        [Column(TypeName = "boolean")]
        public bool? HidePhoneNumber { get; set; }

        [Column(TypeName = "varchar(512)")]
        public string ProfilePictureFilepath { get; set; } = "/images/default_profile_picture.png"; //default profile picture

        [Column(TypeName = "varchar(5)")]
        public string ProfilePictureExtension { get; set; } = ".png";
        public int UserAccountId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }

    }
}
