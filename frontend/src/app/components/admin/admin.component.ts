import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
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
