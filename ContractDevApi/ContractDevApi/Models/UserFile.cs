using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserFile
    {
        [Key]
        public int UserFileId { get; set; }

        [Required]
        public string FilePath { get; set; } = string.Empty;

        [Required]
        public string Extension { get; set; } = string.Empty;

        public int UserAccountId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }
    }
}
