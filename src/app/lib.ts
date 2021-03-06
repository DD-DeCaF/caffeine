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

// This file contains all application specific helper functions
// It can depend on third parties, typings

import * as types from './app-interactive-map/types';

const defaultBounds: types.Bounds = {
  lowerBound: -1000,
  upperBound: 1000,
};

export const mapBiggReactionToCobra = (reaction): types.Cobra.Reaction => ({
  name: reaction.name,
  id: reaction.bigg_id || reaction.id,
  gene_reaction_rule: reaction.gene_reaction_rule || '',
  lower_bound: reaction.hasOwnProperty('lower_bound')
                ? reaction.lower_bound
                : defaultBounds.lowerBound,
  upper_bound: reaction.hasOwnProperty('upper_bound')
                ? reaction.upper_bound
                : defaultBounds.upperBound,
  metabolites: reaction.metabolites || {},
  annotation: reaction.annotation || {},
});
