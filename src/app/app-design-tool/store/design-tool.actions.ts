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

import {Action} from '@ngrx/store';
import * as types from '../../app-interactive-map/types';
import * as typesDesign from '../types';
import {StatePrediction} from '../types';

export const SET_SELECTED_SPECIES_DESIGN = 'SET_SELECTED_SPECIES_DESIGN';
export const FETCH_PRODUCTS_DESIGN = 'FETCH_PRODUCTS_DESIGN';
export const SET_PRODUCTS_DESIGN = 'SET_PRODUCTS_DESIGN';
export const FETCH_JOBS_DESIGN = 'FETCH_JOBS_DESIGN';
export const SET_JOBS_DESIGN = 'SET_JOBS_DESIGN';
export const SET_LAST_JOB_DESIGN = 'SET_LAST_JOB_DESIGN';
export const ABORT_JOB_DESIGN = 'ABORT_JOB_DESIGN';
export const START_DESIGN = 'START_DESIGN';


export class SetSelectedSpeciesDesign implements Action {
  readonly type = SET_SELECTED_SPECIES_DESIGN;
  constructor(public payload: types.Species) {}
}

export class FetchProductsDesign implements Action {
  readonly type = FETCH_PRODUCTS_DESIGN;
}

export class SetProductsDesign implements Action {
  readonly type = SET_PRODUCTS_DESIGN;
  constructor(public payload: typesDesign.Product[]) {}
}

export class FetchJobsDesign implements Action {
  readonly type = FETCH_JOBS_DESIGN;
}

export class SetJobsDesign implements Action {
  readonly type = SET_JOBS_DESIGN;
  constructor(public payload: string[]) {}
}

export class SetLastJobDesign implements Action {
  readonly type = SET_LAST_JOB_DESIGN;
  constructor(public payload: StatePrediction) {}
}

export class AbortJobDesign implements Action {
  readonly type = ABORT_JOB_DESIGN;
  constructor(public payload: string) {}

}

export class StartDesign implements Action {
  readonly type = START_DESIGN;
  constructor(public payload: typesDesign.Design) {}
}

export type DesignToolActions = SetSelectedSpeciesDesign | FetchProductsDesign | SetProductsDesign | StartDesign | AbortJobDesign
  | SetLastJobDesign;
