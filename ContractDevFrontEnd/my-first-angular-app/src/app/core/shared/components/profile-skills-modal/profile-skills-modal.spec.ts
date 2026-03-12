import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSkillsModal } from './profile-skills-modal';

describe('ProfileSkillsModal', () => {
  let component: ProfileSkillsModal;
  let fixture: ComponentFixture<ProfileSkillsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileSkillsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileSkillsModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
