import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { delay, merge } from 'rxjs';
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
    meter: new FormControl(0, Validators.required),
    buyerMeterPrice: new FormControl(0, Validators.required),
    purchaseMeterPrice: new FormControl(0, Validators.required),
    additionalPlusItems: new FormArray([]),
    additionalMinusItems: new FormArray([]),
    profit: new FormControl(0),
    price: new FormControl(0),
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
      this.order.additionalPlusItems.forEach(v => this.addItems(this.additionalPlusItems, v));
      this.order.additionalMinusItems.forEach(v => this.addItems(this.additionalMinusItems, v));

      this.form.patchValue(this.order);
    }

    merge(
      this.form.controls['meter'].valueChanges,
      this.form.controls['buyerMeterPrice'].valueChanges,
      this.form.controls['purchaseMeterPrice'].valueChanges
    ).pipe(
      delay(300)
    ).subscribe(() => this.priceCalc())
  }

  public get additionalPlusItems(): FormArray {
    return this.form.controls['additionalPlusItems'] as FormArray
  }

  public get additionalMinusItems(): FormArray {
    return this.form.controls['additionalMinusItems'] as FormArray
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

    this.priceCalc();

    this.customerService[functName](this.customerId, this.form.value);
    this.onClose.emit();
  }

  addItems(array: FormArray, data?: any) {
    const item = new FormGroup({
      name: new FormControl(),
      price: new FormControl(0)
    });

    item.controls['price'].valueChanges.pipe(
      delay(300)
    ).subscribe(() => this.priceCalc())

    if (data) {
      item.patchValue(data)
    }

    array.insert(0, item)
  }

  removeItems(array: FormArray, index: number) {
    array.removeAt(index);
    this.priceCalc();
  }

  priceCalc() {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      const priceDiff = value.buyerMeterPrice - value.purchaseMeterPrice;
      let profit = priceDiff * value.meter;
      let price = value.meter * value.buyerMeterPrice;

      this.additionalPlusItems.controls.forEach((c) => {
        profit += c.value.price;
        price += c.value.price;
      });

      this.additionalMinusItems.controls.forEach((c) => {
        profit -= c.value.price;
      });

      this.form.patchValue({
        profit: Math.round((profit + Number.EPSILON) * 100) / 100,
        price: Math.round((price + Number.EPSILON) * 100) / 100
      }, { emitEvent: false });
    }
  }

}
