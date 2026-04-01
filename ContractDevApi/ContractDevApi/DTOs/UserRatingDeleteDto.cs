using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    public class UserRatingDeleteDto
    {
        [Required]
        public int ReviewerId { get; set; }

        [Required]
        public int RevieweeId { get; set; }
    }
}
