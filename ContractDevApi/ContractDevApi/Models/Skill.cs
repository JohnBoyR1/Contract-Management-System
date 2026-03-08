using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class Skill
    {
        [Key]
        public int SkillId { get; set; }

        public string SkillName { get; set; } = string.Empty;
    }
}
