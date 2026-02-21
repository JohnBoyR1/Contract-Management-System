import { Component, ViewEncapsulation, signal } from '@angular/core';
import { AboutText } from "../about-text/about-text";



@Component({
  selector: 'app-about',
  imports: [AboutText],
  templateUrl: './about.html',
  styleUrl: './about.css',
  encapsulation: ViewEncapsulation.None //this allows global styles in
})

export class About {

  showAboutText = signal(false);

  toggleAboutText() {
    console.log("clicked");
    this.showAboutText.update(v => !v);
  }
}
