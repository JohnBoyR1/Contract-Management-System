import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { About } from './features/about/about';
import { SignUp } from './features/sign-up/sign-up';
import { Login } from './features/login/login';
import { Carousel } from './features/carousel/carousel';
import { UserProfile } from './features/user-profile/user-profile';
import { BillingDetails } from './features/billing-details/billing-details';
import { Chat } from './features/chat/chat';
import { ProfileCard } from './features/profile-card/profile-card';
import { authGuard } from './core/auth/auth.guard';
import { ProfileGallery } from './features/profile-gallery/profile-gallery';
import { ProfileDisplayCard } from './features/profile-display-card/profile-display-card';

export const routes: Routes = [
    //public routes
    { path: '', component: Home },
    { path: 'about', component: About },
    { path: 'sign-up', component: SignUp },
    { path: 'login', component: Login },
    { path: 'carousel', component: Carousel },
    { path: 'profileGallery', component: ProfileGallery },
    { path: 'profileDisplay', component: ProfileDisplayCard},

    //protectd routes (locked by auth.guard.ts)
    { path: 'user-profile', component: UserProfile, canActivate: [authGuard] },
    { path: 'billing-details', component: BillingDetails, canActivate: [authGuard] },
    { path: 'chat', component: Chat, outlet: 'popup', canActivate: [authGuard] },//this prevents it from replacing the main content
    { path: 'profile-card', component: ProfileCard, canActivate: [authGuard] },
    //fallback too

    { path: '**', redirectTo: '' }
];
