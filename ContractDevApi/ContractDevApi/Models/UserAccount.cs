using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{

    //-----------------------
    //UserAccount model - if no model exists on the database, ef database update will create table via Entity Framework
    //-----------------------
    public class UserAccount
    {

        [Key]
        public int UserAccountId { get; set; }

        //Email does not need mimimum length here as DTO will ensure email validation
        [Required]
        [StringLength(255)]
        [EmailAddress]
        [Column(TypeName = "varchar(255)")]
        public string UserSignupEmail { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "text")]
        public string SecurityQuestion { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "text")]
        public string SecurityAnswer { get; set; } = string.Empty;

        //Hashed
        [Required]
        [Column(TypeName = "text")]
        public string HashedPassword { get; set; } = string.Empty;

    }
}
