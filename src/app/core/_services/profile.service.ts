import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    loadSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');
    updateSubject: BehaviorSubject<any> = new BehaviorSubject<any>('');

    constructor() { }
}
