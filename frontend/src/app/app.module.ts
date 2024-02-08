import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { EditOrderComponent } from './components/order/edit-order/edit-order.component';
import { GetOrdersComponent } from './components/order/get-orders/get-orders.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { OrderService } from './services/order.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    CreateOrderComponent,
    EditOrderComponent,
    GetOrdersComponent,
    AdminComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ButtonModule,
    DividerModule,
    MenubarModule,
    TableModule,
    CardModule,
    FormsModule,
    PanelModule,
    RadioButtonModule,
    InputTextModule,
    InputNumberModule,
    ToastModule,
    DialogModule,
    DropdownModule,
  ],
  providers: [DialogService, MessageService, ConfirmationService, OrderService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
