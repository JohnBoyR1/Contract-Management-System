using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ContractDevApi.Models;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //UpdateDTO used to check if properties being received from Front-End contain non-default values
    //bool? signifies a nullable bool type as True or False are valid values, but False is the default state
    //If bool value is set to null, system can assume that the user does not want to update that property
    //-----------------------
    public class ProfileUpdateDto
    {
        [Required]
        public int Id { get; set; }
        public string? Username { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        public string? Country { get; set; }

        public string? Description { get; set; }
        public string? UserTitle { get; set; }

        public string? Bio { get; set; }

        public bool? AvailableForWork { get; set; }

        public bool? OfferingWork { get; set; }

        public bool? DisplayUserName { get; set; }

        public bool? HidePhoneNumber { get; set; }

        public string? FacebookLink { get; set; }

        public string? UserSocialEmailLink { get; set; }

        public string? XLink { get; set; }

        public string? GithubLink { get; set; }

        public string? LinkedinLink { get; set; }

        public List<string> Skills { get; set; } = new List<string>();
    }
}
