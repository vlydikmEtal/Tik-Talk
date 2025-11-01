import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef,
  inject, Renderer2

} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MockService, Feature } from './mock.service';
import { KeyValuePipe } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


enum ReciverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

export const dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const begin = group.get('dateBegin')?.value;
  const end = group.get('dateEnd')?.value;

  if (!begin || !end) return null;

  const beginDate = new Date(begin);
  const endDate = new Date(end);

  return beginDate > endDate ? { dateRange: true } : null;
};

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? '', Validators.required),
    street: new FormControl<string>(initialValue.street ?? '', Validators.required),
    building: new FormControl<number | null>(initialValue.building ?? null, Validators.required),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null, Validators.required)
  });
}

@Component({
  selector: 'tt-forms-experiment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormExperimentComponent implements AfterViewInit {
  ReciverType = ReciverType;
  cdr = inject(ChangeDetectorRef);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  mockService = inject(MockService);

  #resizeSub?: Subscription;
  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<ReciverType>(ReciverType.PERSON),
    name: new FormControl<string>('', Validators.required),
    inn: new FormControl<string>(''),
    lastName: new FormControl<string>('', Validators.required),
    dateBegin: new FormControl<string>('', Validators.required),
    dateEnd: new FormControl<string>('', Validators.required),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({})
  }, { validators: dateRangeValidator });

  ngAfterViewInit() {
    this.resizeFeed();
    this.#resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.resizeFeed());
  }

  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 48;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

  ngOnDestroy() {
    this.#resizeSub?.unsubscribe();
  }

  constructor() {
    // Загрузка адресов
    this.mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {
        const addressesArray = this.form.controls.addresses as FormArray;
        addressesArray.clear();
        for (const addr of addrs) {
          addressesArray.push(getAddressForm(addr));
        }
        this.cdr.markForCheck();
      });

    // Загрузка дополнительных фич
    this.mockService.getFeature()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features;
        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          );
        }
        this.cdr.markForCheck();
      });

    // Валидаторы для типа получателя
    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        const innControl = this.form.controls.inn;
        innControl.clearValidators();
        if (val === ReciverType.LEGAL) {
          innControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
        }
        innControl.updateValueAndValidity({ emitEvent: false });
        this.cdr.markForCheck();
      });

    // Валидатор диапазона дат при изменении значений
    this.form.controls.dateBegin.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
    this.form.controls.dateEnd.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.updateValueAndValidity({ emitEvent: false }));
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.getRawValue());
  }

  addAddress() {
    (this.form.controls.addresses as FormArray).insert(0, getAddressForm());
    this.cdr.markForCheck();
  }

  deleteAddress(index: number) {
    (this.form.controls.addresses as FormArray).removeAt(index, { emitEvent: false });
    this.cdr.markForCheck();
  }

  sort = () => 0;
}
