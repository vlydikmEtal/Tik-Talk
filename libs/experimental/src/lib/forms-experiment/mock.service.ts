import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class MockService {

  getAddresses() {
    // const addresses: Address[] = [
    //   { city: 'Москва', street: 'Арбат', building: 12, apartment: 34 },
    //   { city: 'Санкт-Петербург', street: 'Невский проспект', building: 50, apartment: 10 },
    //   { city: 'Казань', street: 'Баумана', building: 7, apartment: 5 }
    // ]
    //
    // return of(addresses);

    return of([
      { city: 'Москва', street: 'Арбат', building: 12, apartment: 34 },
      { city: 'Санкт-Петербург', street: 'Невский проспект', building: 50, apartment: 10 }
    ]);
  }

  getFeature(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false
      }
    ]);
  }
}
