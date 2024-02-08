import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [
  ]
})
export class UserComponent implements OnInit {
  displayDialog = false;
  inputResponsibleName = '';
  responsibleName: string | null = null;

  constructor(private orderService: OrderService, private userService: UserService) {}

  ngOnInit(): void {
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

  openCreateOrderDialog() {
    this.orderService.openCreateOrderDialog();
  }
}
