export interface Profile {
  userId: number;

  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  country: string;

  userTitle: string;
  bio: string;

  availableForWork: boolean;
  offeringWork: boolean;
  displayUserName: boolean;
  hidePhoneNumber: boolean;

  //profile images
  profileImagePath: string | null;
  profileImageExtension: string | null;

  socials: { [key: string]: string | null };

  numberOfReviews: number;
  totalReviewPoints: number;
  averageReviewScore: number;
}

