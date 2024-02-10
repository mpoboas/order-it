import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Meta } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styles: [
  ]
})
export class AdminComponent implements OnInit {
  displayAdminDialog = false;
  displayPasswordDialog = false;
  inputAdminName = '';
  inputPassword = '';
  adminName: string | null = null;
  allowedAdminAccess = false;

  constructor(private meta: Meta, private titleService: Title, private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.titleService.setTitle('Order It! - Admin');
    this.meta.updateTag({ name: 'title', content: 'Order It! - Admin' });
    this.meta.updateTag({ name: 'description', content: 'Gere todos os pedidos na Order It!, define preços e muito mais!' });
    this.adminName = this.userService.getAdminName();
    this.allowedAdminAccess = this.userService.getAllowedAdminAccess();

    if (!this.allowedAdminAccess) {
      this.displayPasswordDialog = true;
    }
    if (this.allowedAdminAccess && !this.adminName) {
      this.openAdminDialog();
    }
  }

  openPasswordDialog(): void {
    this.displayPasswordDialog = true;
  }

  validatePassword(): void {
    // Check if the entered password is correct
    if (this.inputPassword === 'mirtilos24') {
      this.userService.setAllowedAdminAccess(true); // Save in localStorage
      this.displayPasswordDialog = false; // Close password dialog
      if (!this.adminName) this.openAdminDialog(); // Open admin dialog after successful password entry (if adminName is not set yet)
    } else {
      this.messageService.add({ severity: 'error', summary: 'Password incorreta', detail: 'Tenta outra vez!' });
    }
  }

  openAdminDialog(): void {
    this.displayAdminDialog = true;
  }

  setAdminName(): void {
    this.userService.setAdminName(this.inputAdminName);
    this.displayAdminDialog = false;
    this.adminName = this.inputAdminName;
    this.inputAdminName = '';
  }

  resetResponsibleName(): void {
    this.userService.clearResponsibleName();
    this.adminName = null;
  }
}