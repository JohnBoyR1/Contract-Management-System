export interface Profile {
  userId: number;

  userTitle: string;
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
  country: string;
  description: string;
  bio: string;

  availableForWork: boolean;
  offeringWork: boolean;
  displayUserName: boolean;
  hidePhoneNumber: boolean;

  //profile images
  profileImagePath: string | null;

  //skills
  skills: string[];
  selectedSkills: string[];

  securityQuestion: string;

  socials: { [key: string]: string | null };

  numberOfReviews: number;
  totalReviewPoints: number;
  averageReviewScore: number;
  //social media links
  facebookLink: string;
  userSocialEmailLink: string;
  xLink: string;
  gitHubLink: string;
  linkedinLink: string;
  
}
