import {Component, OnInit} from '@angular/core';
import {OrderService} from 'src/app/services/order.service';
import {UserService} from 'src/app/services/user.service';
import {Meta} from '@angular/platform-browser';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {
  displayDialog = false;
  inputResponsibleName = '';
  responsibleName: string | null = null;

  constructor(private meta: Meta, private titleService: Title, private orderService: OrderService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Order It! - Pedidos');
    this.meta.updateTag({name: 'title', content: 'Order It! - Pedidos'});
    this.meta.updateTag({name: 'description', content: 'Vê todos os teus pedidos na Order It!'});


    this.responsibleName = this.userService.getResponsibleName();

    if (!this.responsibleName) {
      this.openDialog();
    }
  }

  openDialog(): void {
    this.displayDialog = true;
  }

  setResponsibleName(): void {
    this.userService.setResponsibleName(this.inputResponsibleName);
    this.displayDialog = false;
    this.responsibleName = this.inputResponsibleName;
    this.inputResponsibleName = '';
  }

  resetResponsibleName(): void {
    this.userService.clearResponsibleName();
    this.responsibleName = null;
  }

  openCreateOrderDialog(): void {
    this.orderService.createOrder({responsibleName: this.responsibleName}).subscribe(
      (response: any) => {
        console.log('Order created successfully', response);
        this.orderService.setCurrentOrderId(response.id);
        this.orderService.setCurrentOrderNumber(response.orderNumber);
        this.orderService.openCreateOrderDialog();
      },
      (error: any) => {
        console.error('Error creating order', error);
      }
    );
  }
}
