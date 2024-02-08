import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [
  ]
})
export class AdminComponent implements OnInit {
  displayDialog = false;
  inputAdminName = '';
  adminName: string | null = null;

  constructor(private meta: Meta, private titleService: Title, private userService: UserService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Order It! - Admin');
    this.meta.updateTag({ name: 'title', content: 'Order It! - Admin' });
    this.meta.updateTag({ name: 'description', content: 'Gere todos os pedidos na Order It! define preços e muito mais!' });
    this.adminName = this.userService.getAdminName();

    if (!this.adminName) {
      this.openDialog();
    }
  }

  openDialog(): void {
    this.displayDialog = true;
  }

  setAdminName(): void {
    this.userService.setAdminName(this.inputAdminName);
    this.displayDialog = false;
    this.adminName = this.inputAdminName;
    this.inputAdminName = '';
  }

  resetResponsibleName(): void {
    this.userService.clearResponsibleName();
    this.adminName = null;
  }
}
