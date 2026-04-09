import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';


@Component({
  selector: 'app-intro-banner',
  imports: [],
  templateUrl: './intro-banner.html',
  styleUrl: './intro-banner.css',
})
export class IntroBanner  {
  
  // isLoggedIn() verify a user logged in or not 
  authService = inject(AuthService);

  // path to the initial intro video
  public currentVideo = "assets/videos/loading.mp4";

  //  this is to ensure the intro video plays on refresh
  @ViewChild('introVideo') introVideo!: ElementRef<HTMLVideoElement>;


  //###################Video (changes to next video)###################
  onVideoEnded() {
    const vid = this.introVideo.nativeElement;
    //when first video ends switch to the next video
    if (this.currentVideo === "assets/videos/loading.mp4") {
      this.currentVideo = "assets/videos/software_blueprint.mp4";

      // ensure loop for second video
      setTimeout(() => vid.loop = true);
    }
  }


  
  ngAfterViewInit() {
    //################### Auto play video on Browser refresh ###############
    const vid = this.introVideo.nativeElement;
    
    // Ensure autoplay rules are satisfied
    vid.muted = true;
    vid.playsInline = true;
  
    // Try to play after Angular finishes rendering
    setTimeout(() => {
      vid.play().catch(() => {});
    }, 0);
    

            //Fade in effect//
    //######################## EFFECTs WHEN SCROLLING ######################
    const elements = document.querySelectorAll('.intro');//All returns a node list

    //The browser’s built‑in IntersectionObserver system (non-angular)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');//fade in when visible    
        } else {
          entry.target.classList.remove('visible');// removes when not visible
        }
          
      });
    }, {
      root: null, //viewport
      threshold: 0.99, //99% of the element is visible
      rootMargin: "20% 0px 20% 0px"//this creates a narrow band in the middle of the screen
    });
    // watch each .into element
    elements.forEach(element => observer.observe(element));
  }
}
