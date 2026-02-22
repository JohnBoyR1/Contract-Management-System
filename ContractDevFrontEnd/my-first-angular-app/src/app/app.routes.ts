import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { SignUp } from './features/sign-up/sign-up';
import { Login } from './features/login/login';
import { IntroBanner } from './features/intro-banner/intro-banner';
import { UserProfile } from './features/user-profile/user-profile';
import { BillingDetails } from './features/billing-details/billing-details';
import { Chat } from './features/chat/chat';
import { ProfileCard } from './features/profile-card/profile-card';
import { authGuard } from './core/auth/auth.guard';
import { ProfileGallery } from './features/profile-gallery/profile-gallery';
import { ProfileDisplayCard } from './features/profile-display-card/profile-display-card';
import { UserProfileSecurity } from './features/user-profile-security/user-profile-security'; 


export const routes: Routes = [
    //public routes
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'sign-up', component: SignUp },
    { path: 'login', component: Login },
    { path: 'intro-banner', component: IntroBanner },
    { path: 'profileGallery', component: ProfileGallery },
    { path: 'profileDisplay', component: ProfileDisplayCard},
    { path: 'userProfileSecurity', component: UserProfileSecurity},

    //protectd routes (locked by auth.guard.ts)
    { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
    { path: 'billing-details', component: BillingDetails, canActivate: [authGuard] },
    { path: 'chat', component: Chat, outlet: 'popup', canActivate: [authGuard] },//this prevents it from replacing the main content
    { path: 'profile-card', component: ProfileCard, canActivate: [authGuard] },
    //fallback too

    { path: '**', redirectTo: '' }
];
