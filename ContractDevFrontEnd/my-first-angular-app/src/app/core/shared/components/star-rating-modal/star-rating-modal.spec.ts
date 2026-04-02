import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarRatingModal } from './star-rating-modal';

describe('StarRating', () => {
  let component: StarRatingModal;
  let fixture: ComponentFixture<StarRatingModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarRatingModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarRatingModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
