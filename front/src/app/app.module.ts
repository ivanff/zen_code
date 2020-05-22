import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {GalleryComponent} from './gallery/gallery.component';
import {AddComponent} from './add/add.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {
  GalleryCommentsResolver,
  GalleryItemComponent,
  GalleryItemResolver
} from './gallery-item/gallery-item.component';
import {ngfModule} from "angular-file";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GalleryComponent,
    AddComponent,
    LoginComponent,
    RegisterComponent,
    GalleryItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ngfModule
  ],
  providers: [
    GalleryItemResolver,
    GalleryCommentsResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
