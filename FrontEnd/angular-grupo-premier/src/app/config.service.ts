import { Injectable } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClientModule) { }
}