using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class SocialConnection
    {
        [Key]
        public int UserAccountId { get; set; }

        [Column("facebook_link")]
        public string FacebookLink { get; set; } = string.Empty;

        [Column("user_social_email_link")]
        public string UserSocialEmailLink { get; set; } = string.Empty;

        [Column("x_link")]
        public string XLink { get; set; } = string.Empty;

        [Column("github_link")]
        public string GithubLink { get; set; } = string.Empty;

        [Column("linkedin_link")]
        public string LinkedinLink { get; set; } = string.Empty;

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }
    }
}
