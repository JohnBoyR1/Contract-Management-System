using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserFile
    {
        [Key]
        public int UserFileId { get; set; }

        [Required]
        public string FilePath { get; set; } = "/images/default_profile_picture.png";

        [Required]
        public string Extension { get; set; } = ".png";

        public int UserAccountId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }
    }
}
