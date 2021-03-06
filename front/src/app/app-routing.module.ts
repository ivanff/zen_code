import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {GalleryComponent} from "./gallery/gallery.component";
import {RegisterComponent} from "./register/register.component";
import {AddComponent, CanActivateAuthRequired} from "./add/add.component";
import {
  GalleryCommentsResolver,
  GalleryItemComponent,
  GalleryItemResolver
} from "./gallery-item/gallery-item.component";
import {NotFoundComponent} from "./not-found/not-found.component";


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
    component: AddComponent,
    canActivate: [CanActivateAuthRequired]
  },
  {
    path: 'gallery/:id',
    component: GalleryItemComponent,
    resolve: {
      item: GalleryItemResolver,
      comments: GalleryCommentsResolver
    }
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
