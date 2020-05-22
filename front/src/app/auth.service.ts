import {Injectable} from '@angular/core';
import {of, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../environments/environment";
import {catchError, tap} from "rxjs/operators";

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
    withCredentials: true,
    headers: {
      "X-CSRFToken": this.cookieService.get('csrftoken')
    }
  };

  constructor(private cookieService: CookieService,
              private http: HttpClient) {
    this.user$.subscribe((value => this.user = value))
  };

  setUser(user: IUser | null): void {
    this.user$.next(user)
    if (user) {
      this.httpOptions.headers["X-CSRFToken"] = this.cookieService.get('csrftoken')
    }
  }

  getUser(): Promise<any> {
    return this.http.get(`${environment.backendGalery}/user/`).pipe(
      catchError((err: any) => {
        return of(null)
      }),
      tap((user: IUser | null) => {
        this.setUser(user)
      })
    ).toPromise()
  }

  logout(callback?: any): void {
    this.http.get(`${environment.backendGalery}/user/logout/`).subscribe(() => {
      this.setUser(null);
      callback()
    })
  }
}
