import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { mergeMap } from 'rxjs';
import { Customer, CustomersService, Order } from 'src/app/shared/services/customers.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

interface Filter {
  customerId: string[],
  from: Date,
  to: Date
}

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {

  filter: FormGroup = new FormGroup({
    customerId: new FormControl<string[]>([]),
    from: new FormControl(),
    to: new FormControl()
  });

  _customers: Customer[] = [];
  allCustomers: Customer[] = [];

  constructor(
    private customersService: CustomersService,
    public navigation: NavigationService
  ) { }

  ngOnInit(): void {
    this.filter.valueChanges.pipe(
      mergeMap(async (v) => this.updateCustomers(v))
    ).subscribe((c) => {
      this._customers = c
        .map(cus => {
          return {
            ...cus,
            orders: cus.orders.filter(o => o.isCompleted && o.isPaid),
            totalProfit: cus.orders.filter(o => o.isCompleted && o.isPaid).map(o => +o.profit).reduce((a, b) => a + b, 0)
          }
        })
    });

    this.customersService.customers$.subscribe(c => {
      this._customers = c
        .map(cus => {
          return {
            ...cus,
            orders: cus.orders.filter(o => o.isCompleted && o.isPaid),
            totalProfit: cus.orders.filter(o => o.isCompleted && o.isPaid).map(o => +o.profit).reduce((a, b) => a + b, 0)
          }
        });
      this.allCustomers = c
        .map(cus => {
          return {
            ...cus,
            orders: cus.orders.filter(o => o.isCompleted && o.isPaid),
            totalProfit: cus.orders.filter(o => o.isCompleted && o.isPaid).map(o => +o.profit).reduce((a, b) => a + b, 0)
          }
        });
    })
  }

  updateCustomers(v: Filter) {
    if (!Object.values(v).filter(v => Array.isArray(v) ? v.length : v).length) {
      return this.allCustomers
    }

    let _customers: any[] = [...this.allCustomers];
    if (v.customerId.length) {
      _customers = _customers.filter((c) => v.customerId.includes(c.id))
    }
    if (+v.from && !+v.to) {
      _customers = _customers.map((c) => {
        let orders = c?.orders.filter((o: Order) => +v.from < o.updated);
        return orders?.length ? Object.assign(c, {orders: orders}) : null
      })
    }
    if (+v.to && !+v.from) {
      _customers = _customers.map((c) => {
        let orders = c?.orders.filter((o: Order) => o.updated < +v.to);
        return orders?.length ? Object.assign(c, {orders: orders}) : null
      })
    }

    if (+v.to && +v.from) {
      _customers = _customers.map((c) => {
        let orders = c?.orders.filter((o: Order) => (+v.from < o.updated) && (+v.to > o.updated));
        return orders?.length ? Object.assign(c, {orders: orders}) : null
      })
    }

    return _customers.filter(c => c) as Customer[]
  }

  public get customers(): Customer[] {
    return this._customers
  }

  public get totalProfit(): number {
    return Math.round((this.customers.reduce((a, b) => a + (b.totalProfit || 0), 0)) * 100) / 100
  }
}
