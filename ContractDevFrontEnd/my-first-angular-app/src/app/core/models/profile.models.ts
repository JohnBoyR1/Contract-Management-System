/*
 Represents a complete user profile returned from the backend.
 So this model can be used throughout the application:
  Displaying user details
  Editing profile information
  Rendering the profile gallery
  Managing skills, socials, and reviewing stats
 */

export interface Profile {
  // Unique user identifier (primary key from database)
  userId: number;

  // Basic identity fields
  userTitle: string;
  firstName: string;
  lastName: string;
  username: string;

  // Contact information
  phoneNumber: string;
  email: string;
  country: string;

  // Profile text content
  description: string;  // Short description or tagline
  bio: string;  // Longer personal biography

  // Visibility + availability toggles
  availableForWork: boolean;   // User is open to job offers
  offeringWork: boolean;       // User is hiring / offering jobs
  displayUserName: boolean;    // Controls username visibility
  hidePhoneNumber: boolean;    // Controls phone number visibility


  //profile image (null if user has no image, back end issues a generic image)
  profileImagePath: string | null;

  //skills
  skills: string[];  // All skills user has saved
  selectedSkills: string[]; // Skills selected in UI (e.g., editing modal)

  // Security question for account recovery
  securityQuestion: string;

  // Social media links stored as key-value pairs
  // Example: { facebook: "url", github: "url" }
  socials: { [key: string]: string | null };

  // ADD THIS: This matches the "Ratings" dictionary from your C# ProfileResponseDto
  ratings?: { [key: string]: number };

  // Review statistics (used for rating system)
  existingRating?: {
    time_management_score: number;
    payment_reliability_score: number;
    communication_score: number;
    collaboration_score: number;
    recommendation_score: number;
  } | null;

  //social media links
  facebookLink: string;
  userSocialEmailLink: string;
  xLink: string;  
  gitHubLink: string;
  linkedinLink: string;
  
}
