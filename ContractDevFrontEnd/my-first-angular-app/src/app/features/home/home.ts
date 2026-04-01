import { Component,ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { IntroBanner } from '../intro-banner/intro-banner';
import { signal } from '@angular/core';
import { MarketingBanner } from "../marketing-banner/marketing-banner";




@Component({
  selector: 'app-home',
  imports: [IntroBanner, MarketingBanner],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
  encapsulation: ViewEncapsulation.None //this allows styles in home.css to affect child components
})

export class Home implements AfterViewInit {

  index = signal(0);
  //learning to create signals and see what can be done(for testing)
  count = signal(3);

  increase(){
    this.count.update(value => value +1);
  }
  
  

  ngAfterViewInit() {
    
    //########################## the small box ###########################
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

    //###################Auto Play Bottom Page Video#############
    const bottomPageVideo = document.querySelector('.bottom-video') as HTMLVideoElement;

    bottomPageVideo.addEventListener('loadeddata', () => {
      bottomPageVideo.play();
    })

  }

  quotes = [
    "Every great piece of technology started as someone’s small, stubborn idea.",
    "Code is proof that even the most complex problems can be solved one line at a time.",
    "Innovation begins the moment you stop asking ‘Can I?’ and start asking ‘How do I?’",
    "In tech, progress isn’t about perfection — it’s about iteration.",
    "The future belongs to those who stay curious long after others stop asking questions.",
    "Every bug fixed is a reminder that persistence beats complexity.",
    "Technology moves fast, but belief in yourself moves faster.",
    "Behind every breakthrough is someone who refused to accept the first error message.",
    "You don’t need to know everything — just enough to start, learn, and keep going.",
    "The best developers aren’t the ones who know the most, but the ones who never stop learning."
  ];

 

  nextQuote() {
    this.index.update(i => (i + 1) % this.quotes.length);
  }

}




