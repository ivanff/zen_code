import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

export interface IUser {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: IUser | null;
  user$ = new Subject<IUser | null>();
  httpOptions = {
    headers: {
      "X-CSRFToken": this.cookieService.get('csrftoken')
    }
  };

  constructor(private cookieService: CookieService) {
    this.user$.subscribe((value => this.user = value))
  };

  setUser(user: IUser | null): void {
    this.user$.next(user)
  }

  getUserName(): string {
    return this.user.name || this.user.email
  }
}
