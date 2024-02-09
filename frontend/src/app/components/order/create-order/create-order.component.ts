import {Component, ElementRef, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {OrderService} from 'src/app/services/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styles: []
})
export class CreateOrderComponent implements OnInit {
  orderData: any = {
    orderNumber: this.orderService.getCurrentOrderNumber(),
    responsibleName: '',
    items: []
  };
  newItemData: any = {
    itemName: '',
    itemBrandType: '',
    itemUnitsQuantity: 1,
  };

  constructor(public ref: DynamicDialogRef, private messageService: MessageService, private orderService: OrderService) {
  }

  ngOnInit(): void {
    // Get the responsibleName from localStorage and set it to the orderData
    let storedValue = localStorage.getItem('responsibleName');
    this.orderData.responsibleName = storedValue ? JSON.parse(storedValue).name : '';
    this.addItemForm();
  }

  finalizeOrder(): void {
    // Check if any itemName is null or empty
    const itemWithoutName = this.orderData.items.find((item: { itemName: any; }) => !item.itemName);
    const itemWithoutBrand = this.orderData.items.find((item: { itemBrandType: any; }) => !item.itemBrandType);
    if (itemWithoutName) {
      this.messageService.add({severity: 'error', summary: 'Erro', detail: 'O nome do produto não pode estar vazio!'});
      return;
    } else if (itemWithoutBrand) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `Seleciona a marca que prentendes do produto: ${itemWithoutBrand.itemName}!`
      });
      return;
    }

    // Check if the order had a note
    if (this.orderData.orderNote) {
      this.addNoteToOrder();
    }

    // For demonstration purposes, we'll just close the dialog
    this.addOrder();
    this.ref.close();
    this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Pedido efetuado com sucesso!'});

  }

  cancel(): void {
    this.orderService.deleteOrder(this.orderService.getCurrentOrderId()!).subscribe(
      (response: any) => {
        console.log('Order deleted successfully', response);
      },
      (error: any) => {
        console.error('Error deleting order', error);
      }
    );
    this.ref.close();
  }

  createItemForm(): void {
    // Validate and add item to the order
    if (this.newItemData.itemName && this.newItemData.itemBrandType && this.newItemData.itemUnitsQuantity >= 1) {
      this.orderData.items.push({...this.newItemData});
      // Clear the newItem form for the next item
      this.newItemData = {itemName: '', itemBrandType: '', itemUnitsQuantity: 1};
    }
  }

  addItemForm(): void {
    this.createItemForm();
    this.orderData.items.push({itemName: '', itemBrandType: '', itemUnitsQuantity: 1});
  }

  addOrder(): void {
    this.orderService.addOrder(this.orderData);
  }

  addedItemsIndexes: any[] = [];

  isItemAdded(i: number) {
    return this.addedItemsIndexes.includes(i);
  }

  addItemToOrder(itemData: any, itemAddedIndex: any): void {
    console.log('Adding item to order', itemData);
    itemData.orderId = this.orderService.getCurrentOrderId();
    this.orderService.addItemToOrder(itemData).subscribe(
      (response: any) => {
        this.messageService.add({severity: 'success', summary: 'Successo', detail: 'Item adicionado com sucesso!'});
        this.addedItemsIndexes.push(itemAddedIndex);
      },
      (error: any) => {
        console.error('Error adding item', error);
      }
    );
  }

  isOrderValid(): boolean {
    const invalidItems = this.orderData.items.some((item: {
        itemName: any;
        itemBrandType: any;
        itemUnitsQuantity: number;
      }) =>
        !item.itemName || !item.itemBrandType || item.itemUnitsQuantity < 1
    );

    return !invalidItems;
  }

  isItemValid(item: any): boolean {
    return item.itemName && item.itemBrandType && item.itemUnitsQuantity >= 1;
  }

  addNoteToOrder(): void {
    const orderId = this.orderService.getCurrentOrderId();
    this.orderService.updateOrder(orderId, {orderNote: this.orderData.orderNote}).subscribe(
      (response: any) => {
        console.log('Note added successfully', response);
      },
      (error: any) => {
        console.error('Error adding note', error);
      }
    );
  }
  
}
