import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {OrderService} from 'src/app/services/order.service';
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styles: []
})
export class GetOrdersComponent implements OnInit {
  @Input() isAdminPage: any;
  orderDialog: boolean = false;
  inAdminPage: boolean = true;
  allowedAdminAccess: boolean = false;
  selectedOrder: any;
  orders: any[] = [];
  orderItemsMap: { [orderId: number]: any[] } = {};
  editedItem: any = {};
  clonedItems: { [key: number]: any } = {};


  constructor(private orderService: OrderService, private messageService: MessageService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.allowedAdminAccess = this.userService.getAllowedAdminAccess();

    this.orderService.orderUpdated$.subscribe(() => {
      this.loadOrders();
    });
    this.loadOrders();
  }

  loadOrders(): void {
    if (this.isAdminPage) {
      this.orderService.getOrders().subscribe(orders => {
        this.orders = orders;
      });
    } else {
      const responsibleName = this.userService.getResponsibleName();
      this.orderService.getOrdersByResponsibleName(responsibleName).subscribe(orders => {
        this.orders = orders;
      });
    }
  }

  onDeleteButtonClick() {
    // A ideia era abrir outro modal para confirmar a exclusão
    this.performDelete(this.selectedOrder);
  }

  onSaveOrderButtonClick() {
    const orderData = {
      orderNote: this.selectedOrder.orderNote,
      receiverName: this.selectedOrder.receiverName,
      payerName: this.selectedOrder.payerName,
    }
    this.orderService.updateOrder(this.selectedOrder.id, orderData).subscribe(() => {
      this.orderService.updateOrdersTable();
      this.orderDialog = false;
    });
  }

  performDelete(order: any): void {
    this.orderService.deleteOrder(order.id).subscribe(() => {
      this.orderService.updateOrdersTable();
      this.orderDialog = false;
    });
  }

  onRowExpand(event: any): void {
    const order = event.data;
    this.getOrderItems(order);
  }

  getOrderItems(order: any): void {
    // Check if order items are already fetched, if not fetch them
    if (!this.orderItemsMap[order.id]) {
      console.log('Fetching order items for order', order);
      this.orderService.getOrderItems(order.id).subscribe(
        (response: any) => {
          this.orderItemsMap[order.id] = response;
        },
        (error: any) => {
          console.error('Error getting order items', error);
        }
      );
    }
  }

  saveOrder() {
    // Create a copy of the orders array
    const orders = [...this.orders];

    // If the selectedOrder already exists in orders, update it; otherwise, add a new order
    const index = orders.findIndex((o) => o.orderNumber === this.selectedOrder.orderNumber);

    if (index !== -1) {
      // Order already exists, update it
      orders[index] = {...this.selectedOrder};
    } else {
      // Order doesn't exist, add a new one
      orders.push({...this.selectedOrder});
    }

    // Update the orders array
    this.orders = orders;

    // Close the dialog and reset selectedOrder
    this.orderDialog = false;
    this.selectedOrder = {};
  }

  editOrder(order: any) {
    this.selectedOrder = {...order};
    this.getOrderItems(order);
    this.orderDialog = true;
  }

  // Edit order dialog
  hideDialog() {
    this.orderDialog = false;
  }

  onRowEditInit(item: any) {
    this.clonedItems[item.itemName as any] = {...item};
  }

  onRowEditSave(item: any, index: number) {
    // You may want to perform validation checks here for item properties
    if (item.itemPrice > 0 && item.itemUnitsQuantity >= 0) {
      delete this.clonedItems[item.itemName as any];
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item atualizado'});
    } else {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Preço ou quantidade inválida'});
    }
  }

  onRowEditCancel(item: any, index: number) {
    this.selectedOrder.items[index] = this.clonedItems[item.itemName as any];
    delete this.clonedItems[item.itemName as any];
  }

  isAdmin(): boolean {
    let storedValue = localStorage.getItem('adminName');
    return !!(storedValue && JSON.parse(storedValue).name && this.isAdminPage);
  }

  onItemEditSave(item: any) {
    const itemData = {
      itemName: item.itemName,
      itemBrandType: item.itemBrandType,
      itemUnitsQuantity: item.itemUnitsQuantity,
      itemPrice: item.itemPrice
    };
    this.orderService.editItem(item.id, itemData).subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Item atualizado'});
      this.orderService.updateOrdersTable();
    });
  }
}
