import { Component } from '@angular/core';
import { Carousel } from 'bootstrap';
import type { CarouselEvent } from 'bootstrap';

@Component({
  selector: 'app-marketing-banner',
  imports: [],
  templateUrl: './marketing-banner.html',
  styleUrl: './marketing-banner.css',
})
export class MarketingBanner {


 
  


   ngAfterViewInit() {
    
    const elements = document.querySelectorAll('.marketing-banner');//All returns a node list

    //The browser’s built‑in IntersectionObserver system (non-angular)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('visible');//updating the DOM directly (entry.target)....native browser method (.classList.add) 
         // this.isVisible.set(true);//this is for individual
        } else {
         // this.isVisible.set(false);
         entry.target.classList.add('visible');
        }
          
      });
    }, {
      root: null, //viewport
      threshold: 0.80, //50% of the element is visible
      rootMargin: "20% 0px 20% 0px"//this creates a narrow band in the middle of the screen
    });

    elements.forEach(element => observer.observe(element));
    //////////////////////Carousel Intervals////////////////////////////////////////
    //////////////////////Carousel Intervals Left////////////////////////////////////////
    const imgElementLeft = document.querySelector('#marketing-banner-carousel-left');
    if (imgElementLeft) {
      new Carousel(imgElementLeft, {
        interval: 2500, 
        ride: 'carousel'
      });
    }
  

  //////////////////////Carousel Intervals Center////////////////////////////////////////
    const imgElementCenter = document.querySelector('#marketing-banner-carousel-center');
    if (imgElementCenter) {
      new Carousel(imgElementCenter, {
        interval: 2500, 
        ride: 'carousel'
      });
    }
  

  //////////////////////Carousel Intervals Center////////////////////////////////////////
    const imgElementRight = document.querySelector('#marketing-banner-carousel-right');
    if (imgElementRight) {
      new Carousel(imgElementRight, {
        interval: 2500, 
        ride: 'carousel'
      });
    }
  }
}

