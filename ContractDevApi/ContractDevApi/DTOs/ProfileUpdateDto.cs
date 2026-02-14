using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ContractDevApi.Models;

namespace ContractDevApi.DTOs
{
    public class ProfileUpdateDto
    {
        public string PhoneNumber { get; set; } = string.Empty;

        public string Bio { get; set; } = string.Empty;

        public bool? AvailableForWork { get; set; } = false;

        public bool? OfferingWork { get; set; } = false;

        public bool? DisplayUserName { get; set; } = false;

        public bool? HidePhoneNumber { get; set; } = false;
    }
}
