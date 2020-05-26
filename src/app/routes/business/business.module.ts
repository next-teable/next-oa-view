import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { BusinessRoutingModule } from './business-routing.module';
import { BusinessGoodsComponent } from './goods/goods.component';
import { BusinessGoodsEditComponent } from './goods/edit/edit.component';
import { BusinessGoodsViewComponent } from './goods/view/view.component';

const COMPONENTS = [
  BusinessGoodsComponent];
const COMPONENTS_NOROUNT = [
  BusinessGoodsEditComponent,
  BusinessGoodsViewComponent,
];

@NgModule({
  imports: [
    SharedModule,
    BusinessRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class BusinessModule { }
