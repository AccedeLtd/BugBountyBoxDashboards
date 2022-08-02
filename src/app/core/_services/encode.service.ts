import { Injectable } from '@angular/core';
import {Buffer} from 'buffer';

@Injectable({ providedIn: 'root' })
export class EncodeService {
  constructor() { }

  encode(data: any,) {
    return Buffer.from(data, 'utf8').toString('base64');
  }
  
  decode(data: any,) {
    return Buffer.from(data, 'base64').toString('utf8');
  }

}
