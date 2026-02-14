// This namespace groups all model classes for the API.
// "Models" is a standard folder name in .NET projects for data structures.
namespace MyApp.Api.Models
{
    // The User class represents a single user record in the database.
    // It is also the shape of the data sent to/from Angular.
    public class User
    {
        // Primary key for the Users table..
        // EF Core + MySQL will auto-increment this value.
        public int UserId { get; set; }

        // The user's first name.
        // Comes from Angular's signup form and profile edit form.
        public string FirstName { get; set; }

        // Comes from Angular's signup form and profile edit form.
        public string LastName { get; set; }

        // The username they choose during signup. sign-up.html and login.html
        public string Username { get; set; }

        // The user's email address.
        // Used for login, notifications, and identity sign-up.html and login.html
        public string Email { get; set; }

        // The hashed password (never store plain text passwords).
        // Angular sign-up.html and login.html will send a plain password during signup,
        // and the backend will convert it to a secure hash.
        public string PasswordHash { get; set; }

        //phone number for contact or verification.
        public string? PhoneNumber { get; set; }

        // The user's selected country.
        // his matches the Angular sign-up.html page country dropdown menu
        public string Country { get; set; }

        // The user's role or type:
        // "developer", "client", or "Both".
        // This matches the Angular sign-up.html page radio button
        public string? Description { get; set; }

        // A longer biography or personal description (input only in user-profile.html).
        public string? Bio { get; set; }

        // Whether the user is available for work (e.g., a developer posting availabilty and set the developer, ring boarder aroung their profile picture Red)
        // Also controlled by a toggle button in Angular App in the user-profile.html
        public bool? AvailableForWork { get; set; }

        // Whether the user is offering work (e.g., a client posting jobs and set the clients ring boarder aroung their profile picture Yellow)
        // Also controlled by a toggle button in Angular App in the user-profile.html
        public bool? OfferingWork { get; set; }

        // Whether the user wants their username visible publicly(hides their first and last name)
        // Also controlled by a toggle button in Angular App in the user-profile.html
        public bool? DisplayUserName { get; set; }

        // Whether the user wants to hide their phone number from others.
        // Also controlled by a toggle button in Angular App in the user-profile.html
        public bool? HidePhoneNumber { get; set; }
    }
}