// Copyright 2018 Novo Nordisk Foundation Center for Biosustainability, DTU.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as fromModelsActions from './models.actions';
import * as types from '../../app-interactive-map/types';

export interface ModelsState {
  model: types.DeCaF.Model;
  error: boolean;
  removedModel: boolean;
}

export const initialState: ModelsState = {
  model: null,
  error: false,
  removedModel: false,
};


export function modelsReducer(
  state: ModelsState = initialState,
  action: fromModelsActions.ModelsActions,
): ModelsState {
  switch (action.type) {
    case fromModelsActions.SET_MODEL_MODELS:
      return {
        ...state,
        model: action.payload,
      };
    case fromModelsActions.SET_ERROR:
      return {
        ...state,
        error: true,
      };
    case fromModelsActions.RESET_ERROR:
      return {
        ...state,
        error: false,
      };
    case fromModelsActions.REMOVED_MODEL_MODELS:
      return {
        ...state,
        removedModel: true,
      };
    case fromModelsActions.RESET_REMOVED_MODEL_MODELS:
      return {
        ...state,
        error: false,
        removedModel: false,
      };
    default:
      return state;
  }
}
