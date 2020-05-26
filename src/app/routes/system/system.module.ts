import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { SystemRoutingModule } from './system-routing.module';
import { UsersCurdComponent } from './users/users.component';
import { UsersCurdEditComponent } from './users/edit/edit.component';
import { UsersCurdViewComponent } from './users/view/view.component';
import { UsersSelectionComponent } from './users/selection/selection.component';
import { SystemRolesComponent } from './roles/roles.component';
import { SystemRolesEditComponent } from './roles/edit/edit.component';
import { SystemRolesViewComponent } from './roles/view/view.component';
import { SystemOrganizationsComponent } from './organizations/organizations.component';
import { SystemOrganizationsEditComponent } from './organizations/edit/edit.component';
import { SystemOrganizationsViewComponent } from './organizations/view/view.component';
import { RoleSelectionComponent } from './users/bindRoles/selection.component';
import { SystemCustomersComponent } from './customers/customers.component';
import { SystemCustomersEditComponent } from './customers/edit/edit.component';
import { SystemCustomersViewComponent } from './customers/view/view.component';
import { SystemAuditLogsComponent } from './audit-logs/audit-logs.component';
import { SystemAuditLogsViewComponent } from './audit-logs/view/view.component';
import { SystemCustomersCreateComponent } from './customers/create/create.component';
import { SystemDictsComponent } from './dicts/dicts.component';
import { SystemDictsEditComponent } from './dicts/edit/edit.component';
import { SystemDictsViewComponent } from './dicts/view/view.component';
import { SystemDictsItemEditComponent } from './dicts/item-edit/item-edit.component';
import { SystemSupplierComponent } from './supplier/supplier.component';
import { SystemSupplierEditComponent } from './supplier/edit/edit.component';
import { SystemSupplierViewComponent } from './supplier/view/view.component';
import { SystemProductComponent } from './product/product.component';
import { SystemProductEditComponent } from './product/edit/edit.component';
import { SystemProductViewComponent } from './product/view/view.component';
import { SystemSelectionEditComponent } from './selection/edit/edit.component';
import { ResetPwdComponent } from './users/resetPwd/resetPwd.component';
import { SystemSelectionViewComponent } from './selection/view/view.component';

const COMPONENTS = [
  UsersCurdComponent,
  SystemRolesComponent,
  SystemOrganizationsComponent,
  SystemCustomersComponent,
  SystemAuditLogsComponent,
  SystemDictsComponent,
  SystemSupplierComponent,
  SystemProductComponent,
];
const COMPONENTS_NOROUNT = [
  UsersCurdEditComponent,
  UsersCurdViewComponent,
  UsersSelectionComponent,
  RoleSelectionComponent,
  SystemRolesEditComponent,
  SystemRolesViewComponent,
  SystemOrganizationsEditComponent,
  SystemOrganizationsViewComponent,
  SystemCustomersEditComponent,
  SystemCustomersViewComponent,
  SystemAuditLogsViewComponent,
  SystemCustomersCreateComponent,
  SystemDictsEditComponent,
  SystemDictsViewComponent,
  SystemDictsItemEditComponent,
  SystemSupplierEditComponent,
  SystemSupplierViewComponent,
  SystemProductEditComponent,
  SystemProductViewComponent,
  SystemSelectionEditComponent,
  SystemSelectionViewComponent,
  ResetPwdComponent,
];

@NgModule({
  imports: [SharedModule, SystemRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class SystemModule {}
