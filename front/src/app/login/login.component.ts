import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService, IUser} from "../auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  onSubmit(value): void {
    if (this.loginForm.status == 'VALID') {
      this.loginForm.reset();
      this.auth.setUser({
        email: value.email,
        name: ""
      } as IUser);
      this.router.navigate(['/']);
    }
  }
}
