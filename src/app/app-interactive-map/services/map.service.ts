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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as types from '../types';
import { environment } from '../../../environments/environment';
import { objectMatcher } from '../../utils';

const preferredMapItem = {
  model: 'iJO1366',
  name: 'Central metabolism',
};

const preferredMapsByModel = {
  'iJO1366': 'Central metabolism',
  'e_coli_core': 'Central metabolism',
  'iJN746': 'Central metabolism',
  'iMM904': 'Central metabolism',
};

@Injectable()
export class MapService {

  constructor(
    private http: HttpClient,
  ) {}

  public static createMapSelector(model: string): (items: types.MapItem[]) => types.MapItem {
    return objectMatcher<types.MapItem>([
      {model, name: preferredMapsByModel[model]},
      {model},
      preferredMapItem,
    ]);
  }

  loadMaps(): Observable<types.MapItem[]> {
    return this.http.get<types.MapItem[]>(`${environment.apis.map}/list`);
  }


}
