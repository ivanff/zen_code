import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

export interface IUser {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user!: IUser | null;

  public user$ = new Subject<IUser | null>();

  constructor() {
    this.user$.subscribe((value => this.user = value))
  };

  setUser(user: IUser| null): void {
    this.user$.next(user)
  }

  getUserName(): string {
    return this.user.name || this.user.email
  }
}
