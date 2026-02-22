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
        public string PhoneNumber { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public bool? AvailableForWork { get; set; } = false;

        public bool? OfferingWork { get; set; } = false;

        public bool? DisplayUserName { get; set; } = false;

        public bool? HidePhoneNumber { get; set; } = false;
    }
}
