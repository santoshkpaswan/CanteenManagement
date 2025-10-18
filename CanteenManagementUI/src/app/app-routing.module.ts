// Angular Import
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from 'src/app/services/guards/auth.guard';
import { NoAuthGuard } from 'src/app/services/guards/noAuth.guard';
import { SignInComponent } from 'src/app/page/authentication/sign-in/sign-in.component';
import { HomeComponent } from 'src/app/page/home/home.component';
import { NoAccessComponent } from 'src/app/page/error/no-access/no-access.component';
import { NotFoundComponent } from 'src/app/page//error/not-found/not-found.component';
import { AboutUsComponent } from 'src/app/page//about-us/about-us.component';
import { FoodDayComponent } from 'src/app/page//food-day/food-day.component';
import {FoodMenuItemComponent} from 'src/app/page//food-menu-item/food-menu-item.component'
import {FoodMenuItemPriceComponent} from 'src/app/page//food-menu-item-price/food-menu-item-price.component'
import {DayWiseFoodMenuItemComponent} from 'src/app/page//day-wise-food-menu-item/day-wise-food-menu-item.component'
import {OrderHistoryComponent} from 'src/app/page/order-history/order-histroy.component'
import { OrderItemComponent } from 'src/app/page/order-item/order-item.component';
import {AdminOrderComponent} from 'src/app/page/admin-order/admin-order.component'



const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component : SignInComponent
},
{
  path: 'signin',
  component : SignInComponent
},
  {
    path: '',
    component: AdminComponent,
   canActivate: [AuthGuard],
   canActivateChild: [AuthGuard],
    children: [
      {
        path: 'user/home',
        component: HomeComponent
      },
      {
        path: 'canteen/food-day',
        component: FoodDayComponent
      },
       {
        path: 'canteen/food-menu-item',
        component: FoodMenuItemComponent
      },
      {
        path: 'canteen/food-menu-item-price',
        component: FoodMenuItemPriceComponent
      },
      {
        path: 'canteen/day-wise-food-menu-item',
        component: DayWiseFoodMenuItemComponent
      },
      {
        path: 'canteen/order-history',
        component: OrderHistoryComponent
      },
      {
        path: 'canteen/order-item',
        component: OrderItemComponent
      },
      {
        path: 'canteen/admin-order',
        component: AdminOrderComponent
      },
      { path: '',
       component: HomeComponent
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
