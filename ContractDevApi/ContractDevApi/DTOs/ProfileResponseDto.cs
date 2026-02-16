namespace ContractDevApi.DTOs
{
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

        public string Bio { get; set; } = string.Empty;

        public bool? AvailableForWork { get; set; } = false;

        public bool? OfferingWork { get; set; } = false;

        public bool? DisplayUserName { get; set; } = false;

        public bool? HidePhoneNumber { get; set; } = false;
    }
}
