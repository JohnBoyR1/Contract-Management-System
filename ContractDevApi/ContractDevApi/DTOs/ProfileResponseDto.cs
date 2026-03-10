using ContractDevApi.Models;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //This ResponseDTO is responsible for sending the combined User and Profile entity to the Front-End
    //Requires that the database context is queried via Entity Framework to create lists of both User and Profiles
    //A Linq query is used to combine both User and Profile Lists into a single list, joining on UserId
    //UserId is UserAccountId on the database - naming discrepency a result of naming convention not being aligned between different systems
    //-----------------------
    public class ProfileResponseDto
    {
        public int UserId { get; set; }

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string UserTitle { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public string SecurityQuestion { get; set; } = string.Empty;

        public bool? AvailableForWork { get; set; } = false;

        public bool? OfferingWork { get; set; } = false;

        public bool? DisplayUserName { get; set; } = false;

        public bool? HidePhoneNumber { get; set; } = false;

        public string ProfileImagePath { get; set; } = string.Empty;

        public Dictionary<string, string?> Socials { get; set; } = new Dictionary<string,string?>();

        public int NumberOfReviews { get; set; }

        public float TotalReviewPoints { get; set; }

        public float AverageReviewScore { get; set; }

        public List<string> Skills { get; set; } = new List<string>();
    }
}
