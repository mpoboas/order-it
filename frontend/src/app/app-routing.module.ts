import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { HeroComponent } from './components/hero.component';

const routes: Routes = [
  { path: 'url-super-secreto', component: AdminComponent },
  { path: 'pedidos', component: UserComponent },
  { path: 'home', component: HeroComponent},
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
