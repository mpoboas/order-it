import { Component } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styles: [
  ]
})
export class CreateOrderComponent {
  orderData: any = {
    orderNumber: this.generateOrderNumber(),
    orderNote: '',
    payerName: '',
    responsibleName: '',
    items: []
  };
  //{ itemName: 'Laranjas', itemBrandType: 'Valencia', itemUnitsQuantity: 1, orderId: 3, itemPrice: 0.5 },
  newItemData: any = {
    itemName: '',
    itemBrandType: '',
    itemUnitsQuantity: 1,
    itemPrice: ''
  };

  constructor(public ref: DynamicDialogRef, private orderService: OrderService) {}

  generateOrderNumber(): number {
    // Logic to generate a unique order number (you can replace this with your logic)
    return Math.floor(Math.random() * 1000) + 1;
  }

  createOrder(): void {
    // Validate and handle the order creation logic
    // For demonstration purposes, we'll just close the dialog
    this.addOrder();
    this.ref.close();
  }

  cancel(): void {
    this.ref.close();
  }

  addNewItem(): void {
    // Validate and add item to the order
    if (this.newItemData.itemName && this.newItemData.itemBrandType && this.newItemData.itemUnitsQuantity >= 1) {
      this.orderData.items.push({ ...this.newItemData });
      // Clear the newItem form for the next item
      this.newItemData = { itemName: '', itemBrandType: '', itemUnitsQuantity: 1, itemPrice: '' };
    }
  }

  addItem(): void {
    this.addNewItem(); // Add the current item
    // Add a new empty item for the next form
    this.orderData.items.push({ itemName: '', itemBrandType: '', itemUnitsQuantity: 1, itemPrice: '' });
  }

  addOrder(): void {
    this.orderService.addOrder(this.orderData);
  }

}