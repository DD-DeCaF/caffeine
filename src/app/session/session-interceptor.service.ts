// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {SessionService} from './session.service';
import {AUTHORIZATION_TOKEN} from './consts';

@Injectable()
export class SessionInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {
  }
  // tslint:disable-next-line:no-any
  public intercept(req: HttpRequest<Request>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sessionService = this.injector.get(SessionService);

    const sessionJWT = localStorage.getItem(AUTHORIZATION_TOKEN);

    if (sessionJWT && sessionService.isTrustedURL(req.url)) {
      req = req.clone({headers: req.headers.set('Authorization', `Bearer ${sessionJWT}`)});
    }

    return next.handle(req).pipe(
      tap(
        () => { /* no-empty */ },
        (response) => {
          if (response.status === 401) {
            sessionService.logout();
          }
        },
      ));
  }
}