import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Customer, CustomersService, Order } from 'src/app/shared/services/customers.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.scss']
})
export class CustomerOrdersComponent implements OnInit {
  customer!: Customer;
  display: boolean = false;
  orderForEdit!: Order | null;
  id!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customersService: CustomersService,
    private confirmationService: ConfirmationService,
    public navigation: NavigationService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(
      (params) => {
        this.id = params.get('id');
        this.customersService.customers$.subscribe((c: Customer[]) => {
          const customer = c.find(c => c.id == this.id);
          if (customer) {
            this.customer = customer
          }
        })
      }
    );
  }

  get orders() {
    return this.customer?.orders.sort((a, b) => b.updated - a.updated)
  }

  edit(order: Order) {
    this.orderForEdit = order;
    this.display = true;
  }

  delete(btn: any, order: Order) {
    this.confirmationService.confirm({
      target: btn,
      message: 'Точно потрібно видалити це замовлення?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customersService.deleteOrder(this.id, order)
      },
      reject: () => {
        //reject action
      },
      rejectLabel: 'Ні',
      acceptLabel: 'Так'
    });
  }

}
