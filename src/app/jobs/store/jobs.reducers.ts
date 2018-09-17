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

import { Job } from '../types';
import * as fromJobsActions from './jobs.actions';

export interface JobsState {
  jobs: Job[];
  loading: boolean;
  failed: boolean;
}

export const initialState: JobsState = {
  jobs: [],
  loading: false,
  failed: false,
};

export function jobsReducer(
  state: JobsState = initialState,
  action: fromJobsActions.JobsActions,
): JobsState {
  switch (action.type) {
    case fromJobsActions.FETCH_JOBS:
      return {
        ...state,
        loading: true,
      };
    case fromJobsActions.FETCH_JOBS_SUCCESS:
      return {
        ...state,
        loading: false,
        jobs: action.payload,
      };
    case fromJobsActions.FETCH_JOBS_FAILED:
      return {
        ...state,
        jobs: [],
        loading: false,
        failed: true,
      };
    default:
      return state;
  }
}