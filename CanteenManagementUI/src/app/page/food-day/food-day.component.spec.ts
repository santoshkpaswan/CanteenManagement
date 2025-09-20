import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodDayComponent } from './food-day.component';

describe('FoodDayComponent', () => {
  let component: FoodDayComponent;
  let fixture: ComponentFixture<FoodDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoodDayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FoodDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
