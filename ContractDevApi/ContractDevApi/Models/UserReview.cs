using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    [Obsolete("This class is deprecated and will be removed. Please Use UserRating instead.")]
    public class UserReview
    {
        [Key]
        public int UserAccountId { get; set; }

        [Required]
        public int NumberOfReviews { get; set; }

        [Required]
        public float TotalReviewPoints { get; set; }

        [Required]
        public float AverageReviewScore { get; set; }

        [ForeignKey("UserAccountId")]
        public UserAccount? UserAccount { get; set; }

    }
}
