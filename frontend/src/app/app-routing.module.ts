import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: 'url-super-secreto', component: AdminComponent },
  { path: 'pedido', component: UserComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
