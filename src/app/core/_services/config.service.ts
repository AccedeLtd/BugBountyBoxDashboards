import { Injectable } from '@angular/core';
import {Buffer} from 'buffer';
import { constants } from '../_utils/const';
import { EncodeService } from './encode.service';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  configId: string | undefined;
  
  constructor(
    public encodeService: EncodeService,
  ) { }

  getCurrentConfigId() {
    let configId = null;
    const hashedConfigId = sessionStorage.getItem(constants.CONFIGID);
    if(hashedConfigId) configId = this.encodeService.decode(hashedConfigId);

    if(configId) this.configId = configId;

    return configId;
  }
  
  setCurrentConfigId(configId: string) {
    const encodedData = this.encodeService.encode(configId);
    sessionStorage.setItem(constants.CONFIGID, encodedData);
  }

  clear() {
    sessionStorage.removeItem(constants.CONFIGID);
  }
}
