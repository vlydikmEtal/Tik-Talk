import { Router } from '@angular/router';
import { AuthService } from './../../auth/auth.service';
import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { from } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  AuthService = inject(AuthService);
  router = inject(Router);

  form = new FormGroup({
    username: new FormControl <string | null> (null, Validators.required),
    password: new FormControl <string | null> (null, Validators.required),
  });


  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.AuthService.login(this.form.value).subscribe((val) => {
        this.router.navigate(['']);
        console.log(val);
      });
    }
  }
}
