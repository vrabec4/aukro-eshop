import { Routes } from '@angular/router';
import { CartPageComponent } from './features/cart/pages/cart-page/cart-page.component';
import { ShopPageComponent } from './features/shop/pages/shop-page/shop-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'shop' },
  { path: 'shop', component: ShopPageComponent, title: 'Shop' },
  { path: 'cart', component: CartPageComponent, title: 'Basket' },
  { path: '**', redirectTo: 'shop' },
];
