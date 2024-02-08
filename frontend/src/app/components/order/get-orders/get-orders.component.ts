import { Component, Input, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styles: [
  ]
})
export class GetOrdersComponent implements OnInit {
  @Input() isAdminPage: any;
  orderDialog: boolean = false;
  inAdminPage: boolean = true;
  selectedOrder: any;
  orders: any[] = [];
  orderItems: { [key: number]: any[] } = {};
  cols: any[];
  editedItem: any = {};
  clonedItems: { [key: number]: any } = {};


  constructor(private orderService: OrderService, private messageService: MessageService) {
    this.cols = [
      { field: 'orderNumber', header: '#' },
      { field: 'orderNote', header: 'Nota' },
      { field: 'payerName', header: 'Pagar a' },
      { field: 'total', header: 'Total' },
    ];
  }

  ngOnInit(): void {
    this.orderService.getOrdersWithItems().subscribe(orders => {
      this.orders = orders;
    });
  }

  calculateTotal(order: any): number {
    // Implement your logic to calculate the total from items' prices
    return order.items.reduce((total: any, item: { itemPrice: any; itemUnitsQuantity: any }) => total + ((item.itemPrice || 0) * (item.itemUnitsQuantity || 0)), 0);
  }

  saveOrder() {
    // Create a copy of the orders array
    const orders = [...this.orders];
    
    // If the selectedOrder already exists in orders, update it; otherwise, add a new order
    const index = orders.findIndex((o) => o.orderNumber === this.selectedOrder.orderNumber);
  
    if (index !== -1) {
      // Order already exists, update it
      orders[index] = { ...this.selectedOrder };
    } else {
      // Order doesn't exist, add a new one
      orders.push({ ...this.selectedOrder });
    }
  
    // Update the orders array
    this.orders = orders;
  
    // Close the dialog and reset selectedOrder
    this.orderDialog = false;
    this.selectedOrder = {};
  }
  
  editOrder(order: any) {
    this.selectedOrder = { ...order };
    this.orderDialog = true;
  }

  // Edit order dialog
  hideDialog() {
    this.orderDialog = false;
  }

  onRowEditInit(item: any) {
    this.clonedItems[item.itemName as any] = { ...item };
  }

  onRowEditSave(item: any, index: number) {
      // You may want to perform validation checks here for item properties
      if (item.itemPrice > 0 && item.itemUnitsQuantity >= 0) {
          delete this.clonedItems[item.itemName as any];
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Item atualizado' });
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Preço ou quantidade inválida' });
      }
  }

  onRowEditCancel(item: any, index: number) {
      this.selectedOrder.items[index] = this.clonedItems[item.itemName as any];
      delete this.clonedItems[item.itemName as any];
  }

  isAdmin(): boolean {
    let storedValue = localStorage.getItem('adminName');
    if (storedValue && JSON.parse(storedValue).name && this.isAdminPage) {
      return true;
    }
    return false;
  }
}
