import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService, IUser} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm;
  message;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private http: HttpClient) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  onSubmit(value): void {
    if (this.loginForm.status == 'VALID') {
      this.http.post(`${environment.backendGalery}/user/login/`, value, this.auth.httpOptions).subscribe((user: IUser) => {
        this.loginForm.reset();
        this.auth.setUser(user);
        this.router.navigate(['/']);
      }, (err) => {
        let message = '';
        if (err.error instanceof Object) {
          for (let [key, value] of Object.entries(err.error)) {
            //@ts-ignore
            message += value.join(',');
          }
        }
        this.message = message
      });
    }
  }
}
