export interface Profile {
  userId: string;

  availableForWork: boolean;
  offeringWork: boolean;
  displayUserName: boolean;
  hidePhoneNumber: boolean;

  phoneNumber: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  country: string;

  description: "developer" | "client" | "Both";
  bio: string;
}
