import { Component, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-intro-banner',
  imports: [],
  templateUrl: './intro-banner.html',
  styleUrl: './intro-banner.css',
})
export class IntroBanner  {
  
  // isLoggedIn() verify a user logged in or not 
  authService = inject(AuthService);

  // introVideo loading... file path
  public currentVideo = "assets/videos/loading.mp4";

  // no:1 this is to ensure the intro video plays on refresh
  @ViewChild('introVideo') introVideo!: ElementRef<HTMLVideoElement>;


  //###################Video (changes video)###################
  onVideoEnded() {
    const vid = this.introVideo.nativeElement;

    if (this.currentVideo === "assets/videos/loading.mp4") {
      this.currentVideo = "assets/videos/software_blueprint.mp4";

      // ensure loop for second video
      setTimeout(() => vid.loop = true);
    }
  }


  
  ngAfterViewInit() {
    //################### Video Play on Browser refresh ###############
    const vid = this.introVideo.nativeElement;
    
    // Ensure autoplay rules are satisfied
    vid.muted = true;
    vid.playsInline = true;
  
    // Try to play after Angular hydration
    setTimeout(() => {
      vid.play().catch(() => {});
    }, 0);
    


    //######################## EFFECTs WHEN SCROLLING ######################
    const elements = document.querySelectorAll('.intro');//All returns a node list

    //The browser’s built‑in IntersectionObserver system (non-angular)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');//updating the DOM directly (entry.target)....native browser method (.classList.add) 
         // this.isVisible.set(true);//this is for individual
        } else {
         // this.isVisible.set(false);
         entry.target.classList.remove('visible');
        }
          
      });
    }, {
      root: null, //viewport
      threshold: 0.99, //50% of the element is visible
      rootMargin: "20% 0px 20% 0px"//this creates a narrow band in the middle of the screen
    });

    elements.forEach(element => observer.observe(element));
  }
}
