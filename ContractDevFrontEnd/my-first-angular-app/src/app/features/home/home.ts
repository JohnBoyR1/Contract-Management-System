import { Component,ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { signal } from '@angular/core';



@Component({
  selector: 'app-home',
  imports: [Carousel],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None //this allows styles in home.css to affect child components
})

export class Home implements AfterViewInit {


  //learning to create signals and see what can be done(for testing)
  count = signal(3);

  increase(){
    this.count.update(value => value +1);
  }
  
  

  ngAfterViewInit() {
    
    const elements = document.querySelectorAll('.box');//All returns a node list

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
      threshold: 0.2, //50% of the element is visible
      rootMargin: "-10% 0px -10% 0px"//this creates a narrow band in the middle of the screen
    });

    elements.forEach(element => observer.observe(element));
  }
}

//.classList is a native DOM mutation


