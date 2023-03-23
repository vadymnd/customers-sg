import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, Observable, throwError } from 'rxjs';
import { NgxSpinnerService, PRIMARY_SPINNER } from "ngx-spinner";

export interface Order {
  id: string;
  created: number;
  updated: number;
  productName: string;
  notes: string | number;
  isCompleted: boolean;
  isPaid: boolean;
  meter: string | number;
  buyerMeterPrice: string | number;
  purchaseMeterPrice: string | number;
  additionalPlusItems: {
    name: string
    price: string
  }[];
  additionalMinusItems: {
    name: string
    price: string
  }[];
  profit: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  orders: Order[];
  created: number;
  updated: number;
  notes?: string;
  phone?: string;
  completed?: number;
  not_completed?: number;
  not_paid?: number;
  totalCost?: number;
  totalProfit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private _customers: Customer[] = [];
  private _customers$: Observable<Customer[]>;

  constructor(
    private afs: AngularFirestore,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    this._customers$ = this.afs.doc('s.gonchar/all').valueChanges().pipe(
      catchError(() => throwError(() => alert("Перевірте інтернет-з'єднання"))),
      map((resp: any) => JSON.parse(resp.data))
    );
    this._customers$.subscribe((customers: Customer[]) => {
      this._customers = customers;
      this.spinner.hide(PRIMARY_SPINNER, 500)
    });
  }

  get customers(): Customer[] {
    return this._customers
  }

  get customers$(): Observable<Customer[]> {
    return this._customers$
  }

  deleteOrder(id: string, data: any) {
    const customer = this._customers.find(c => c.id == id);
    if (!customer) {
      return alert('Щось пішло не так')
    }
    const order_index = customer.orders.findIndex(o => o.id == data.id);
    customer.orders.splice(order_index, 1);
    this.updateStorage();
  }

  updateOrder(id: string, data: any, needUpdate?: boolean) {
    const customer = this._customers.find(c => c.id == id);
    if (!customer) {
      return alert('Щось пішло не так')
    }
    const newUpdate = +new Date();
    const old_order_index = customer.orders.findIndex(o => o.id == data.id);

    if (needUpdate) {
      data.updated = newUpdate;
    }

    customer.orders.splice(old_order_index, 1, data);
    this.updateStorage();
  }

  saveOrder(id: string, data: any) {
    const customer = this._customers.find(c => c.id == id);
    if (!customer) {
      return alert('Щось пішло не так')
    }
    const newUpdate = +new Date();
    customer.orders.push({
      ...data,
      updated: newUpdate
    });
    this.updateStorage();
  }

  deleteCustomer(data: Customer) {
    const customer_index = this.customers.findIndex(c => c.id == data.id);
    this._customers.splice(customer_index, 1);
    this.updateStorage();
  }

  updateCustomer(data: Customer) {
    const customer_index = this.customers.findIndex(c => c.id == data.id);
    const newUpdate = +new Date();
    data.updated = newUpdate;
    this._customers.splice(customer_index, 1, data);
    this.updateStorage();
  }

  saveCustomer(data: Customer) {
    this._customers.push(data);
    this.updateStorage();
  }

  updateStorage() {
    this.spinner.show();
    this.afs.doc('s.gonchar/all').update({ data: JSON.stringify(this._customers) })
      .catch(() => alert("Перевірте інтернет-з'єднання"))
      .finally(() => this.spinner.hide(PRIMARY_SPINNER, 500));

    //backup
    const date = new Date();
    this.afs.doc(`s.gonchar/${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`).update({ data: JSON.stringify(this._customers) })
      .catch(() => {
        this.afs.doc(`s.gonchar/${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`).set({ data: JSON.stringify(this._customers) })
      });
  }
}
