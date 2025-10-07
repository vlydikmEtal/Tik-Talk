import { Injectable, signal } from '@angular/core';
import { Profile } from '../../../../../interfaces/src/lib/profile';



@Injectable({
  providedIn: 'root'
})

export class GlobalStoreService {
  me = signal<Profile | null>(null)
}
