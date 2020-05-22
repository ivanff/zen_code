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
  private user!: IUser | null;

  user$ = new Subject();

  constructor() { };

  setUser(user: IUser): void {
    this.user$.next(user)
  }
}
