using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //LoginDTO used as received object from Front-End
    //Using DataAnnotations to ensure that email received is valid email
    //-----------------------
    public class UserLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
