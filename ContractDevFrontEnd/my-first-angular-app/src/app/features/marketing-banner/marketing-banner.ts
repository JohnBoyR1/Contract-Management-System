import { Component } from '@angular/core';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'app-marketing-banner',
  imports: [],
  templateUrl: './marketing-banner.html',
  styleUrl: './marketing-banner.css',
})
export class MarketingBanner {


   ngAfterViewInit() {
    // Fade in / fade out effect for marketing banner
    const elements = document.querySelectorAll('.marketing-banner');

    //The browser’s built‑in IntersectionObserver system (non-angular)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('visible');  //element is in view show      
        } else {
          entry.target.classList.add('visible'); // out of view hide
        }
          
      });
    }, {
      root: null, //viewport
      threshold: 0.80, //80% of the element is visible
      rootMargin: "20% 0px 20% 0px"//this creates a narrow band in the middle of the screen
    });

    elements.forEach(element => observer.observe(element));
    //////////////////////Carousel Intervals////////////////////////////////////////
    //////////////////////Carousel Intervals Left////////////////////////////////////////
    const imgElementLeft = document.querySelector('#marketing-banner-carousel-left');
    if (imgElementLeft) {
      new Carousel(imgElementLeft, {
        interval: 2000, 
        ride: 'carousel'
      });
    }
  

  //////////////////////Carousel Intervals Center////////////////////////////////////////
    const imgElementCenter = document.querySelector('#marketing-banner-carousel-center');
    if (imgElementCenter) {
      new Carousel(imgElementCenter, {
        interval: 2000, 
        ride: 'carousel'
      });
    }
  

  //////////////////////Carousel Intervals Center////////////////////////////////////////
    const imgElementRight = document.querySelector('#marketing-banner-carousel-right');
    if (imgElementRight) {
      new Carousel(imgElementRight, {
        interval: 2000, 
        ride: 'carousel'
      });
    }
  }
}

