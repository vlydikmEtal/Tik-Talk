import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule

} from '@angular/forms';
import { DadataService, DadataSuggestion } from '@tt/data-access';
import { TtInputComponent } from '../tt-input/tt-input.component';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TtInputComponent,
    AsyncPipe
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent)
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor {
  cdr = inject(ChangeDetectorRef);
  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);

  isDropdoenOpened = signal<boolean>(true);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl('')
  });

  suggestions$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(500),
      switchMap(val => {
        return this.#dadataService.getSuggestion(val)
          .pipe(
            tap(res => {
              this.isDropdoenOpened.set(!!res.length);
            })
          );
      })
    );

  writeValue(city: string | null): void {
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    });

    if (!city) {
      this.innerSearchControl.setValue('');
      return;
    }

    const address = city.split(' ');
    this.addressForm.patchValue({
      city: address[0],
      street: address[1],
      building: address[2]
    });

    this.cdr.markForCheck();
  }

  setDisabledState?(isDisabled: boolean) {
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  onChange(value: any) {
  }

  onTouched() {
  }

  onSuggetionPick(suggest: DadataSuggestion) {
    this.isDropdoenOpened.set(false);

    const fullAddress = `${suggest.data.city} ${suggest.data.street} ${suggest.data.house}`;

    // Обновляем input
    this.innerSearchControl.patchValue(fullAddress, {
      emitEvent: false // чтобы не триггерить suggestions$
    });

    // Обновляем form
    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house
    });

    // Передаем выбранное значение в форму
    this.onChange(fullAddress);

    this.cdr.markForCheck();
  }


}
