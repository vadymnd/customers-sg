import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { CustomersComponent } from './customers/customers.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CustomerOrdersComponent } from './customer-orders/customer-orders.component';
import { NewOrderComponent } from './customer-orders/new-order/new-order.component';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { NewCustomerComponent } from './customers/new-customer/new-customer.component';
import { InputMaskModule } from 'primeng/inputmask';
import { FinanceComponent } from './finance/finance.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerOrdersComponent,
    NewOrderComponent,
    NewCustomerComponent,
    FinanceComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ButtonModule,
    TableModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    InputTextareaModule,
    InputMaskModule,
    CheckboxModule,
    ReactiveFormsModule,
    CalendarModule,
    AccordionModule,
    MultiSelectModule
  ]
})
export class DashboardModule { }
