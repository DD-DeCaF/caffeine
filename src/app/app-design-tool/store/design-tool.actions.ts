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

export const FETCH_SPECIES_DESIGN = 'FETCH_SPECIES_DESIGN';
export const SET_SPECIES_DESIGN = 'SET_SPECIES_DESIGN';
export const SET_SELECTED_SPECIES_DESIGN = 'SET_SELECTED_SPECIES_DESIGN';
export const FETCH_MODELS_DESIGN = 'FETCH_MODELS_DESIGN';
export const SET_MODELS_DESIGN = 'SET_MODELS_DESIGN';
export const SET_MODEL_DESIGN = 'SET_MODEL_DESIGN';

export class FetchSpeciesDesign implements Action {
  readonly type = FETCH_SPECIES_DESIGN;
}

export class SetSpeciesDesign implements Action {
  readonly type = SET_SPECIES_DESIGN;
  constructor(public payload: types.Species[]) {}
}

export class SetSelectedSpeciesDesign implements Action {
  readonly type = SET_SELECTED_SPECIES_DESIGN;
  constructor(public payload: types.Species) {}
}

export class FetchModelsDesign implements Action {
  readonly type = FETCH_MODELS_DESIGN;
}

export class SetModelsDesign implements Action {
  readonly type = SET_MODELS_DESIGN;
  constructor(public payload: types.DeCaF.Model[]) {}
}

export class SetModelDesign implements Action {
  readonly type = SET_MODEL_DESIGN;
  constructor(public payload: types.DeCaF.Model) {}
}
export type DesignToolActions = FetchSpeciesDesign | SetSpeciesDesign | SetSelectedSpeciesDesign | FetchModelsDesign | SetModelsDesign | SetModelDesign;
