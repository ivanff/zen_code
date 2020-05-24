import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {GalleryComponent} from './gallery/gallery.component';
import {AddComponent, CanActivateAuthRequired} from './add/add.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {
  GalleryCommentsResolver,
  GalleryItemComponent,
  GalleryItemResolver
} from './gallery-item/gallery-item.component';
import {ngfModule} from "angular-file";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "./auth.service";
import {NotFoundComponent} from './not-found/not-found.component';
import {APP_BASE_HREF} from "@angular/common";
import {environment} from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GalleryComponent,
    AddComponent,
    LoginComponent,
    RegisterComponent,
    GalleryItemComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ngfModule,
  ],
  providers: [
    CookieService,
    GalleryItemResolver,
    GalleryCommentsResolver,
    CanActivateAuthRequired,
    {
      provide: APP_BASE_HREF,
      useValue: environment.baseHref
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => () => auth.getUser(),
      deps: [AuthService, HttpClient],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
