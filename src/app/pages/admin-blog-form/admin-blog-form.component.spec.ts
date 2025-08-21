import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBlogFormComponent } from './admin-blog-form.component';

describe('AdminBlogFormComponent', () => {
  let component: AdminBlogFormComponent;
  let fixture: ComponentFixture<AdminBlogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBlogFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminBlogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
