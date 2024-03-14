import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroInfoComponent } from './libro-info.component';

describe('LibroInfoComponent', () => {
  let component: LibroInfoComponent;
  let fixture: ComponentFixture<LibroInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibroInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
