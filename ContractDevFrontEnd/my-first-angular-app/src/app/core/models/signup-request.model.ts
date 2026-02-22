import { ProfileDescription } from "./profile-description.enum";

export interface SignupRequest {
  firstName: string;
  lastName: string;
  username: string;
  country: string;
  description: ProfileDescription; 
  email: string;
  password: string;
  confirmPassword: string;
}
