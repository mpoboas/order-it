import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent {

  constructor(private orderService: OrderService) {}

  openCreateOrderDialog() {
    this.orderService.openCreateOrderDialog();
  }

}
