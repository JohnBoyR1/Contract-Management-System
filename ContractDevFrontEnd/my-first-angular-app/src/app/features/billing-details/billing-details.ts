import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileStateService } from '../../core/shared/profile-state.service';

@Component({
  selector: 'app-billing-details',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './billing-details.html',
  styleUrl: './billing-details.css',
})
export class BillingDetails {

  constructor(
    public profile: ProfileStateService
  ){}
}
