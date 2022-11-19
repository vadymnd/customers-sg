import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomersService, Order } from 'src/app/shared/services/customers.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss']
})
export class NewOrderComponent implements OnInit {
  @Input() order!: Order | null;
  @Input() customerId!: string;
  @Output() onClose = new EventEmitter();

  form: FormGroup = new FormGroup({
    id: new FormControl(),
    productName: new FormControl(null),
    breastVolume: new FormControl(null),
    waist: new FormControl(null),
    hips: new FormControl(null),
    armLength: new FormControl(null),
    sweaterLength: new FormControl(null),
    innerSeam: new FormControl(null),
    pantsLength: new FormControl(null),
    sweaterSize: new FormControl(null),
    pantsSize: new FormControl(null),
    cuffGirth: new FormControl(null),
    cuffTrouser: new FormControl(null),
    stickers: new FormControl(null),
    price: new FormControl(null),
    costs: new FormControl(null),
    profit: new FormControl(null),
    notes: new FormControl(null),
    isCompleted: new FormControl(false),
    isPaid: new FormControl(false),
    updated: new FormControl(),
    created: new FormControl()
  });

  constructor(
    private customerService: CustomersService
  ) { }

  ngOnInit(): void {
    if (this.order) {
      this.form.patchValue(this.order)
    }
  }

  close() {
    this.onClose.emit();
  }

  saveOrder() {
    const functName = this.form.value.id ? 'updateOrder' : 'saveOrder';
    if (!this.order) {
      this.form.patchValue({
        id: `o${+new Date()}`,
        updated: +new Date(),
        created: +new Date()
      })
    }
    this.customerService[functName](this.customerId, this.form.value);
    this.onClose.emit();
  }

}
