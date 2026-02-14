namespace MyApp.Api.DTOs;

public class UpdateProfileDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Username { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Country { get; set; }
    public string? Description { get; set; }
    public string? Bio { get; set; }

    public bool? AvailableForWork { get; set; }
    public bool? OfferingWork { get; set; }
    public bool? DisplayUserName { get; set; }
    public bool? HidePhoneNumber { get; set; }
}