import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GdprModal } from './gdpr-modal';

describe('GdprModal', () => {
  let component: GdprModal;
  let fixture: ComponentFixture<GdprModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GdprModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GdprModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
