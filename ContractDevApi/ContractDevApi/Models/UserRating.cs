using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ContractDevApi.Models
{
    public class UserRating
    {
        [Key]
        public int RatingId { get; set; }

        [Required]
        public int ReviewerId { get; set; }

        [Required]
        public int UserAccountId { get; set; }

        [Required]
        [Range(1, 5)]
        public int TimeManagementScore { get; set; }

        [Required]
        [Range(1, 5)]
        public int PaymentReliabilityScore { get; set; }

        [Required]
        [Range(1, 5)]
        public int CommunicationScore { get; set; }

        [Required]
        [Range(1, 5)]
        public int CollaborationScore { get; set; }

        [Required]
        [Range(1, 5)]
        public int RecommendationScore { get; set; }

        [ForeignKey(nameof(ReviewerId))]
        public UserAccount? ReviewerAccount { get; set; }


        [ForeignKey(nameof(UserAccountId))]
        public UserAccount? RevieweeAccount { get; set; }

    }
}

/*
-- User individual ratings table
-- Stores the 5 specific community values as 1-5 star ratings
create table user_individual_ratings(
    rating_id SERIAL primary key,
    reviewer_id integer not null,
    user_account_id integer not null, -- The person being rated (Target)

    -- Community Value Categories (Strictly 1-5)
    time_management_score integer not null check (time_management_score between 1 and 5),
    payment_reliability_score integer not null check (payment_reliability_score between 1 and 5),
    communication_score integer not null check (communication_score between 1 and 5),
    collaboration_score integer not null check (collaboration_score between 1 and 5),
    recommendation_score integer not null check (recommendation_score between 1 and 5),

    -- Verification of Constraints & Keys:
    -- 1. Ensure the reviewer exists
    constraint fk_reviewer foreign key(reviewer_id) 
        references user_accounts(user_account_id) 
        on delete cascade,

    -- 2. Ensure the person being rated exists
    constraint fk_target_account foreign key(user_account_id) 
        references user_accounts(user_account_id) 
        on delete cascade,

    -- 3. Prevent a user from rating themselves
    constraint no_self_rating check (reviewer_id <> user_account_id),

    -- 4. Prevent duplicate ratings (One user can only rate another user once)
    constraint unique_rating_pair unique (reviewer_id, user_account_id)
);
*/