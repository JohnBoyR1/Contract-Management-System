using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserSkill
    {
        public int UserAccountId { get; set; }

        public int SkillId { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }

        [ForeignKey("SkillId")]
        public Skill? Skill { get; set; }
    }
}
