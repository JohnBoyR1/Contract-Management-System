using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //ReviewDTO used to associate reviews sent from one User account to another
    //-----------------------
    public class UserReviewDto
    {
        [Required]
        public int ReviewerId { get; set; }

        [Required]
        public int RevieweeId { get; set; }

        [Required]
        [Range(1,5)]
        public int TimeManagementScore { get; set; }

        [Required]
        [Range(1,5)]
        public int PaymentReliabilityScore { get; set; }

        [Required]
        [Range(1,5)]
        public int CommunicationScore { get; set; }

        [Required]
        [Range(1,5)]
        public int CollaborationScore { get; set; }

        [Required]
        [Range(1,5)]
        public int RecomendationScore { get; set; }
    }
}