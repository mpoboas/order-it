import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styles: [
  ]
})
export class CreateOrderComponent implements OnInit {
  orderData: any = {
    orderNumber: this.orderService.getCurrentOrderNumber(),
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

  constructor(public ref: DynamicDialogRef, private messageService: MessageService, private orderService: OrderService) {}

  ngOnInit(): void {
    // Get the responsibleName from localStorage and set it to the orderData
    let storedValue = localStorage.getItem('responsibleName');
    this.orderData.responsibleName = storedValue ? JSON.parse(storedValue).name : '';
    this.addItem();
  }

  createOrder(): void {
    // Check if any itemName is null or empty
    const itemWithoutName = this.orderData.items.find((item: { itemName: any; }) => !item.itemName);
    const itemWithoutBrand = this.orderData.items.find((item: { itemBrandType: any; }) => !item.itemBrandType);
    if (itemWithoutName) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'O nome do produto não pode estar vazio!' });
      return;
    } else if (itemWithoutBrand) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: `Seleciona a marca que prentendes do produto: ${itemWithoutBrand.itemName}!` });
      return;
    }

    // Validate and handle the order creation logic
    // For demonstration purposes, we'll just close the dialog
    this.addOrder();
    this.ref.close();
    this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'Pedido efetuado com sucesso!' });
    this.messageService.add({ severity: 'info', summary: 'Info', detail: "Equanto não temos backend, para ver os pedidos criados clica em 'Admin' e depois em 'User' para atualizar a tabela.", life: 7000 });
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

  isOrderValid(): boolean {
    const invalidItems = this.orderData.items.some((item: { itemName: any; itemBrandType: any; itemUnitsQuantity: number; }) =>
        !item.itemName || !item.itemBrandType || item.itemUnitsQuantity < 1
    );

    return !invalidItems;
}

}
