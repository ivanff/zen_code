import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService, IUser} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  regForm;
  message;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              private http: HttpClient) {
    this.regForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.email]],
      password1: ['', [Validators.required, Validators.maxLength(20)]],
      password2: ['', [Validators.required, RegisterComponent.matchValues('password1'),]],
    })
  }

  ngOnInit(): void {
  }

  public static matchValues(matchTo: string): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
      !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value
        ? null
        : {isMatching: false};
    };
  }

  onSubmit(value): void {
    if (this.regForm.status == 'VALID') {
      this.http.post(`${environment.backendGalery}/user/reg/`, value, this.auth.httpOptions).subscribe((value: IUser) => {
        this.regForm.reset();
        this.router.navigate(['/']);
        this.auth.setUser(value)
      }, (err) => {
        let message = '';
        if (err.error instanceof Object) {
          for (let [key, value] of Object.entries(err.error)) {
            //@ts-ignore
            message += value.join(',');
          }
        }
        this.message = message
      })
    }
  }
}
