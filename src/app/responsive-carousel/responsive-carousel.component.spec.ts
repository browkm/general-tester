import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveCarouselComponent } from './responsive-carousel.component';

describe('ResponsiveCarouselComponent', () => {
  let component: ResponsiveCarouselComponent;
  let fixture: ComponentFixture<ResponsiveCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
