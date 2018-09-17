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

export interface Job {
  id: number;
  started: Date;
  completed?: Date;
  state: 'running' | 'errored' | 'completed' | 'aborted';
  error?: string;
  data: PathwayPrediction;
}

export interface PathwayPrediction {
  type: 'Pathway prediction';
  organism: string;
  product: string;
  model: string;
  numberOfPathways: number;
  // results: PathwayPredictionResult[];
}

export interface PathwayPredictionResult {
  id: string;
  host: string;
  model: string;
  manipulations: {
    direction: 'delta' | 'down' | 'up';
    value: string;
  }[];
  heterologous_pathway: string[];
  fitness: number;
  yield: number;
  product: number;
  biomass: number;
  method: string;
}