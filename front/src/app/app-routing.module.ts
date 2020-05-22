import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {RegisterComponent} from "./register/register.component";
import {AddComponent} from "./add/add.component";


const routes: Routes = [
  {
    path: '',
    component: GalleryComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'add',
    component: AddComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
