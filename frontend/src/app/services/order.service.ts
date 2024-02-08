import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { CreateOrderComponent } from '../components/order/create-order/create-order.component';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.apiUrl + '/api/orders';

  constructor(private http: HttpClient, private dialogService: DialogService) {}

  openCreateOrderDialog() {
    const ref: DynamicDialogRef = this.dialogService.open(CreateOrderComponent, {
      header: 'Efetuar pedido',
      width: '50vh',
      styleClass: 'max-h-700 min-h-700 overflow-auto bg-blue-500',
    });
  }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(this.baseUrl, orderData);
  }

  // Mock data for demonstration purposes | TO BE DELETED
  private orders: any[] = [
    { orderNumber: 1, orderNote: 'This is a note', responsibleName: 'John Doe', payerName: 'Julinho' },
    { orderNumber: 2, orderNote: 'This is another note', responsibleName: 'Jane Doe', payerName: 'Julinha'},
    { orderNumber: 3, orderNote: 'This is yet another note', responsibleName: 'John Doe', payerName: 'Julinho'},
    { orderNumber: 4, orderNote: 'Isto é ganda nota', responsibleName: 'John Doe', payerName: 'Julinho' },
  ];

  private items: any[] = [
    { itemName: 'Bolachas', itemBrandType: 'Continente', itemUnitsQuantity: 1, orderId: 1, itemPrice: 1.5 },
    { itemName: 'Leite', itemBrandType: 'Froiz', itemUnitsQuantity: 1, orderId: 1, itemPrice: 0.5 },
    { itemName: 'Pão', itemBrandType: 'Pingo Doce', itemUnitsQuantity: 1, orderId: 1, itemPrice: 0.3 },
    { itemName: 'Cereais', itemBrandType: 'Nestlé', itemUnitsQuantity: 1, orderId: 2, itemPrice: 2.0 }, 
    { itemName: 'Água', itemBrandType: 'Luso', itemUnitsQuantity: 1, orderId: 2, itemPrice: 0.8 }, 
    { itemName: 'Sumo', itemBrandType: 'Compal', itemUnitsQuantity: 1, orderId: 2, itemPrice: 1.2 }, 
    { itemName: 'Maçãs', itemBrandType: 'Golden', itemUnitsQuantity: 1, orderId: 3, itemPrice: 0.6 }, 
    { itemName: 'Bananas', itemBrandType: 'Chiquita', itemUnitsQuantity: 1, orderId: 3, itemPrice: 0.4 }, 
    { itemName: 'Laranjas', itemBrandType: 'Valencia', itemUnitsQuantity: 1, orderId: 3, itemPrice: 0.5 },
  ];

  // Mock method to add an order
  // orderData: any = {
  //   orderNumber: this.generateOrderNumber(),
  //   orderNote: '',
  //   payerName: '',
  //   responsibleName: '',
  //   items: []
  // };
  addOrder(orderData: any): void {
    this.orders.push(orderData);
    for (const item of orderData.items) {
      this.items.push({ ...item, orderId: orderData.orderNumber });
    }
    console.log('Order added:', orderData);
    console.log('Orders:', this.orders);
  }


  // Mock method to get orders with associated items
  getOrdersWithItems(): Observable<any[]> {
    const ordersWithItems = this.orders.map(order => {
      return {
        ...order,
        items: this.items.filter(item => item.orderId === order.orderNumber)
      };
    });

    return of(ordersWithItems);
  }
}
