import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer, CustomersService } from 'src/app/shared/services/customers.service';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent implements OnInit {
  @Input() customer!: Customer | null;
  @Output() onClose = new EventEmitter();

  form: FormGroup = new FormGroup({
    id: new FormControl(),
    name: new FormControl(null, Validators.required),
    phone: new FormControl(null),
    notes: new FormControl(null),
    created: new FormControl(),
    updated: new FormControl()
  });

  constructor(
    private customerService: CustomersService
  ) { }

  ngOnInit(): void {
    if (this.customer) {
      this.form.patchValue(this.customer)
    }
  }

  close() {
    this.onClose.emit();
  }

  saveCustomer() {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    const functName = this.form.value.id ? 'updateCustomer' : 'saveCustomer';
    if (this.customer) {
      this.customer = Object.assign(this.customer, this.form.value) as Customer
    } else {
      this.customer = {
        id: `c${+new Date()}`,
        name: this.form.value.name,
        phone: this.form.value.phone,
        orders: [],
        created: +new Date(),
        updated: +new Date()
      } as Customer
    }

    this.customerService[functName](this.customer);
    this.onClose.emit();
  }

  onPaste() {
    navigator.clipboard.readText().then((v) => {
      if (v.startsWith('+38', 0)) {
        this.form.patchValue({
          phone: v.replace('+38', '')
        })
      }
    })
  }

}
