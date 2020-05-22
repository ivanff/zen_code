import { Component, OnInit } from '@angular/core';
import {AuthService, IUser} from "../auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user!: IUser | null;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user: IUser | null) => {
      this.user = user
    })
  }

  ngOnInit(): void {
  }

}
