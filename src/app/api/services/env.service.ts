import { Injectable, InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface getBaseUrl {
  getBaseUrl: () => string
}

export const BASE_URL = new InjectionToken<getBaseUrl>('base url');

@Injectable({
  providedIn: 'root'
})
export class EnvService implements getBaseUrl {

  getBaseUrl() {
    return environment.domain;
  }
}
