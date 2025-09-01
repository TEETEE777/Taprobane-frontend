import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductsComponent } from './pages/products/products.component';
import { CartComponent } from './pages/cart/cart.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SellerDashboardComponent } from './pages/seller-dashboard/seller-dashboard.component';
import { BuyerDashboardComponent } from './pages/buyer-dashboard/buyer-dashboard.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { ConfirmationSuccessComponent } from './pages/confirmation-success/confirmation-success.component';
import { SellerAddProductComponent } from './pages/seller-add-product/seller-add-product.component';
import { SellerMyProductsComponent } from './pages/seller-my-products/seller-my-products.component';
import { BlogListComponent } from './pages/blog-list/blog-list.component';
import { BlogDetailsComponent } from './pages/blog-details/blog-details.component';
import { SocialCallbackComponent } from './pages/auth-callback/auth-callback.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { EditProductComponent } from './pages/edit-product/edit-product.component';
import { AddReviewComponent } from './pages/add-review/add-review.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app-login', component: LoginComponent },
  { path: 'app-register', component: RegisterComponent },
  { path: 'app-products', component: ProductsComponent },
  { path: 'app-cart', component: CartComponent },
  { path: 'app-confirmation', component: ConfirmationComponent },
  { path: 'app-checkout', component: CheckoutComponent },
  { path: 'app-product/:id', component: ProductDetailComponent },
  { path: 'app-confirmation-stripe', component: ConfirmationSuccessComponent },
  { path: 'app-reset-password', component: ResetPasswordComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  {
    path: 'app-my-orders',
    loadComponent: () =>
      import('./pages/my-orders/my-orders.component').then(
        (m) => m.MyOrdersComponent
      ),
  },

  {
    path: 'add-review',
    component: AddReviewComponent,
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'seller-dashboard',
    component: SellerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['seller'] },
  },
  {
    path: 'seller-add-product',
    component: SellerAddProductComponent,
    canActivate: [AuthGuard],
    data: { roles: ['seller'] },
  },
  {
    path: 'seller-products',
    loadComponent: () =>
      import('./pages/seller-my-products/seller-my-products.component').then(
        (m) => m.SellerMyProductsComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['seller'] },
  },
  {
    path: 'seller-orders',
    loadComponent: () =>
      import('./pages/seller-orders/seller-orders.component').then(
        (m) => m.SellerOrdersComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['seller'] },
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./pages/contact-us/contact-us.component').then(
        (m) => m.ContactUsComponent
      ),
  },
  { path: 'auth/google/callback', component: SocialCallbackComponent },

  {
    path: 'blogs',
    loadComponent: () =>
      import('./pages/blog-list/blog-list.component').then(
        (m) => m.BlogListComponent
      ),
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./pages/blog-details/blog-details.component').then(
        (m) => m.BlogDetailsComponent
      ),
  },
  {
    path: 'admin/blogs',
    loadComponent: () =>
      import('./pages/admin-blog-list/admin-blog-list.component').then(
        (m) => m.AdminBlogListComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/blogs/new',
    loadComponent: () =>
      import('./pages/admin-blog-form/admin-blog-form.component').then(
        (m) => m.AdminBlogFormComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin/blogs/edit/:id',
    loadComponent: () =>
      import('./pages/admin-blog-form/admin-blog-form.component').then(
        (m) => m.AdminBlogFormComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'admin-add-blog',
    loadComponent: () =>
      import('./pages/admin-add-blog/admin-add-blog.component').then(
        (m) => m.AdminAddBlogComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },

  {
    path: 'admin/sellers',
    loadComponent: () =>
      import('./pages/admin-sellers/admin-sellers.component').then(
        (c) => c.AdminSellersComponent
      ),
  },
  {
    path: 'pending-approval',
    loadComponent: () =>
      import('./components/pending-approval/pending-approval.component').then(
        (m) => m.PendingApprovalComponent
      ),
  },

  {
    path: 'buyer-dashboard',
    component: BuyerDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['buyer'] },
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '**',
    redirectTo: '/app-login',
  },
  {
    path: 'app-payment-success',
    loadComponent: () =>
      import(
        './pages/confirmation-success/confirmation-success.component'
      ).then((m) => m.ConfirmationSuccessComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
