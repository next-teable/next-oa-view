import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessGoodsComponent } from './goods/goods.component';

const routes: Routes = [
  { path: 'goods', component: BusinessGoodsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
