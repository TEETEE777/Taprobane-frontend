import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerMyProductsComponent } from './seller-my-products.component';

describe('SellerMyProductsComponent', () => {
  let component: SellerMyProductsComponent;
  let fixture: ComponentFixture<SellerMyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerMyProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerMyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
