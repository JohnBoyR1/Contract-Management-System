import { Component, Input, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  imports: [],
  standalone: true,
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class Carousel implements OnInit {
  //adding a mode input (this is used to control behaviour)
  @Input() mode: 'fixed' | 'sticky' | 'scroll' | 'fixedUntilScroll' = 'scroll';

  @HostBinding('class') hostClasses ='';

  constructor(private cdr: ChangeDetectorRef) {}

  private onScroll = () => {
    if (this.mode !== 'fixedUntilScroll') return;

    const threshold = 200;
    const isFixed = window.scrollY < threshold;

    //bootstrap classes for fixed positioning
    const newClasses = isFixed 
      ? 'position-fixed top-0 start-0 w-100 z-3' 
      : 'd-block position-relative';

    if (this.hostClasses !== newClasses) {
      this.hostClasses = newClasses;
      //Manually trigger change detection because scroll is outside Angular's zone
      this.cdr.detectChanges();
    }

  }

  ngOnInit() {
    if (this.mode === 'fixedUntilScroll') {
      window.addEventListener('scroll', this.onScroll);
      //Run once on load to set initial state
      this.onScroll();

    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }
}
