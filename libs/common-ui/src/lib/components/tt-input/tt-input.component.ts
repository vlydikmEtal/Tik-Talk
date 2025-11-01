import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  input,
  signal
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent)
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {
  type = input<'text' | 'password'>('text');
  placeholder = input<string>('');

  cdr = inject(ChangeDetectorRef)

  showIcon = input<boolean>(false)

  disabled = signal(false);
  showPassword = signal(false);

  value: string | null = null;

  onChange: any
  onTouched: any

  writeValue(val: string | null): void {
    this.value = val;

    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onModelChange(val: string | null): void {
    this.value = val;
    this.onChange(val);

    this.cdr.markForCheck();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  getInputType(): string {
    if (this.type() !== 'password') return this.type();
    return this.showPassword() ? 'text' : 'password';
  }
}
