import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Customer, CustomersService } from 'src/app/shared/services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  selectedCustomer!: Customer | null;
  customerForEdit!: Customer | null;
  display: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private customersService: CustomersService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['admin']) {
        this.isAdmin = true
      }
    });
  }

  get customers() {
    return this.customersService.customers.sort((a, b) => b.updated - a.updated).map((c: Customer) => {
      return {
        ...c,
        completed: c.orders.filter(o => o.isCompleted).length,
        not_completed: c.orders.filter(o => !o.isCompleted).length,
        not_paid: c.orders.filter(o => !o.isPaid).length
      }
    });
  }

  onRowSelect(customer: Customer) {
    this.router.navigate(["/c", customer.id])
  }

  edit(customer: Customer) {
    this.customerForEdit = customer;
    this.display = true;
  }

  delete(event: Event, customer: Customer) {
    this.confirmationService.confirm({
      target: event.target || undefined,
      message: 'Точно потрібно видалити цього клієнта?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customersService.deleteCustomer(customer)
      },
      reject: () => {
        //reject action
      },
      rejectLabel: 'Ні',
      acceptLabel: 'Так'
    });
  }
}
