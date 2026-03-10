using System.ComponentModel.DataAnnotations;

namespace ContractDevApi.DTOs
{
    //-----------------------
    //Response DTO consists of the data sent back to Front-End when sending just User data
    //Requires that some information is taken from Profile table
    //Generally used when constructing authentication via JWT and Cookies
    //-----------------------
    public class UserResponseDto
    {
        public int UserId { get; set; }

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;


    }
}
