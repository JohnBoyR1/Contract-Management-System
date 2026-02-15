import { Component, AfterViewInit, Input, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-carousel',
  imports: [],
  standalone: true,
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel  {
 
  ngAfterViewInit() {
    
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
