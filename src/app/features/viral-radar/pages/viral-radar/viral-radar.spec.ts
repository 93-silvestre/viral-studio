import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViralRadar } from './viral-radar';

describe('ViralRadar', () => {
  let component: ViralRadar;
  let fixture: ComponentFixture<ViralRadar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViralRadar],
    }).compileComponents();

    fixture = TestBed.createComponent(ViralRadar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
