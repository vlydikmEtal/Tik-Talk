import { Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AuthService } from '@tt/data-access';
import { TtInputComponent } from '@tt/common-ui';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, TtInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent implements OnInit {
  AuthService = inject(AuthService);
  router = inject(Router);
  showPassword = signal(false);

  cdr = inject(ChangeDetectorRef);


  form = new FormGroup({
    username: new FormControl<string | null>('againstallodds6', Validators.required),
    password: new FormControl<string | null>(null, Validators.required)
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      //@ts-ignore
      this.AuthService.login(this.form.value).subscribe((val) => {
        this.router.navigate(['']);
        console.log(val);
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

}
