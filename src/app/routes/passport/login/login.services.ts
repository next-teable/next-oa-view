import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIs } from '@shared/api';

@Injectable()
export class LoginService {
  constructor(private http: HttpClient) {}

  getCapcha() {
    return this.http.get(`${APIs.getCaptcha}`);
  }

  login(authInfo: any) {
    return this.http.post(`${APIs.login}`, authInfo);
  }
}
