import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartToExcelComponent } from './chart-to-excel.component';

describe('ChartToExcelComponent', () => {
  let component: ChartToExcelComponent;
  let fixture: ComponentFixture<ChartToExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartToExcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartToExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
