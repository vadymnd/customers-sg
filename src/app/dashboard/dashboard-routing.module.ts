import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { CustomersComponent } from './customers/customers.component';
import { FinanceComponent } from './finance/finance.component';

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    title: "Покупці"
  },
  {
    path: 'c/:id',
    component: CustomerOrdersComponent,
    title: "Клієнт"
  },
  {
    path: 'finances',
    component: FinanceComponent,
    title: "Прибуток"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
