import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterComponent } from './passport/register/register.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { SystemCustomersSelectionComponent } from './system/customers/selection/selection.component';
import { SystemOrganizationsSelectionComponent } from './system/organizations/selection/selection.component';
import { SystemUsersSingleSelectionComponent } from './system/users/single-selection/single-selection.component';
import { SystemSupplierSelectionComponent } from './system/supplier/selection/selection.component';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
];
const COMPONENTS_NOROUNT = [
  SystemCustomersSelectionComponent,
  SystemOrganizationsSelectionComponent,
  SystemUsersSingleSelectionComponent,
  SystemSupplierSelectionComponent,
];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
