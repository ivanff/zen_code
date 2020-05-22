import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService, IUser} from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  regForm;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService) {
    this.regForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password1: ['', [Validators.required]],
      password2: ['', [Validators.required, RegisterComponent.matchValues('password1'),]],
    })
  }

  ngOnInit(): void {
  }

  public static matchValues(
    matchTo: string // name of the control to match to
  ): (AbstractControl) => ValidationErrors | null {
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
      this.regForm.reset();
      this.auth.setUser({
        email: value.email,
        name: ""
      } as IUser);
      this.router.navigate(['/']);
    }
  }
}
