import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-get-orders',
  templateUrl: './get-orders.component.html',
  styles: [
  ]
})
export class GetOrdersComponent implements OnInit {
  orders: any[] = [];
  orderItems: { [key: number]: any[] } = {};

  cols: any[];

  constructor(private orderService: OrderService) {
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
    return order.items.reduce((total: any, item: { itemPrice: any; }) => total + (item.itemPrice || 0), 0);
  }
}
