import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroAdminComponent } from './libro-admin.component';

describe('LibroAdminComponent', () => {
  let component: LibroAdminComponent;
  let fixture: ComponentFixture<LibroAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibroAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
