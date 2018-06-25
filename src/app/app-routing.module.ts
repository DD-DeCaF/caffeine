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

import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {AppHomeComponent} from './app-home/app-home.component';
import {LoginComponent} from './app-login/app-login.component';
import {AppWelcomeComponent} from './app-welcome/app-welcome.component';


const appRoutes: Route[] = [
  {
    path: '',
    component: AppHomeComponent,
    children: [
      {
        path: '',
        component: AppWelcomeComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes),
    // LoginModule
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
