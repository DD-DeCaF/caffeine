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

export enum CardType {
  Design,
  DataDriven,
}

export interface Reaction {
  bigg_id: string;
  name: string;
  model_bigg_id?: string;
  organism?: string;
}

export interface Bounds {
  lowerBound: number;
  upperBound: number;
}
export interface BoundedReaction extends Bounds {
  reaction: Cobra.Reaction;
}

export enum OperationDirection {
  Do = 'DO',
  Undo = 'UNDO',
}

export type SimpleOperationTarget = 'addedReactions' | 'knockoutReactions' | 'knockoutGenes';
export type BoundOperationTarget = 'bounds';

export type OperationTarget = SimpleOperationTarget| BoundOperationTarget;

export interface KnockoutOperationPayload {
  item: string;
  operationTarget: OperationTarget;
  direction: OperationDirection;
  saved?: boolean;
}

export interface AddedReactionPayload {
  item: AddedReaction;
  operationTarget: OperationTarget;
  direction: OperationDirection;
  saved?: boolean;
}

export interface BoundOperationPayload {
  item: BoundedReaction;
  operationTarget: BoundOperationTarget;
  direction: OperationDirection;
  saved?: boolean;
}
export type OperationPayload = KnockoutOperationPayload | AddedReactionPayload | BoundOperationPayload;
export type ObjectiveDirection = 'min' | 'max';
export interface ObjectiveReactionPayload {
  direction: ObjectiveDirection;
  reactionId: string;
  operationTarget?: string;
  item?: string;
}

export type ObjectiveReaction = ObjectiveReactionPayload;

export interface Card {
  type: CardType;
  name: string;
  model: Cobra.Model;
  model_id: number;
  species: Species;
  solution: DeCaF.Solution;
  method: string;
  addedReactions: AddedReaction[];
  knockoutReactions: string[];
  knockoutGenes: string[];
  objectiveReaction: ObjectiveReaction;
  bounds: BoundedReaction[];
  designId: number;
  projectId: number;
  methodCard: string;
  experiment: Experiment;
  condition: Condition;
  saved: boolean;
  measurements: Measurement[];
  medium: Medium[];
  genotype: string[];
  solutionUpdated: boolean;
  operations?: DeCaF.Operation[];

}

export interface HydratedCard extends Card {
  selected: boolean;
  id: string;
}

// Used in the map selector
export interface MapItem {
  id: number;
  name: string;
  model_id: number;
  project_id: number;
  map?: string;
}

export type Methods = 'fba' | 'pfba' | 'fva' | 'pfba-fva';

export interface Method {
  id: Methods;
  name: string;
}

// Cobrapy object structures as defined by the JSON schema:
// https://github.com/opencobra/cobrapy/blob/devel/cobra/io/json.py#L138
export declare namespace Cobra {
  // A cobrapy model structure as serialized by `cobra.io.model_to_dict`
  export interface Model {
    id: string;
    name?: string;
    description?: string;
    version?: number;
    // tslint:disable-next-line:no-any
    reactions: any[];
    metabolites: Metabolite[];
    genes: {
      id: string;
      name: string;
      notes?: {
        [k: string]: any; // tslint:disable-line
      };
      annotation?: {
        [k: string]: any; // tslint:disable-line
      };
    }[];
    compartments?: {
      [k: string]: string;
    };
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }

  // A cobrapy reaction as serialized by `cobra.io.dict.reaction_to_dict`
  export interface Reaction {
    id: string;
    name: string;
    metabolites: {
      [k: string]: number;
    };
    // The gene_reaction_rule is a boolean representation of the gene
    // requirements for this reaction to be active as described in
    // Schellenberger et al 2011 Nature Protocols 6(9):1290-307.
    // http://dx.doi.org/doi:10.1038/nprot.2011.308
    gene_reaction_rule: string;
    lower_bound: number;
    upper_bound: number;
    objective_coefficient?: number;
    variable_kind?: string;
    subsystem?: string;
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }

  // A cobrapy metabolite as serialized by `cobra.io.dict.metabolite_to_dict`
  export interface Metabolite {
    id: string;
    name: string;
    compartment: string;
    charge?: number;
    formula?: string;
    _bound?: number;
    _constraint_sense?: string;
    notes?: {
      [k: string]: any; // tslint:disable-line
    };
    annotation?: {
      [k: string]: any; // tslint:disable-line
    };
  }
}

// DD-DeCaF platform internal structures
// tslint:disable-next-line
export declare namespace DeCaF {
  // The solution returned from a model simulation request
  export interface Solution {
    growth_rate: number;
    flux_distribution: {
      [reaction_id: string]: number;
    };
  }

  // Operation that can be applied to a model
  export interface Operation {
    operation: 'add' | 'modify' | 'knockout';
    type: 'gene' | 'reaction';
    id: string;
    data?: Cobra.Reaction; // included if operation is 'add' or 'modify'
  }

  export interface ModelHeader {
    id: number;
    project_id?: number;
    name: string;
    organism_id: number;
  }

  export interface Model extends ModelHeader {
    created: string;
    updated?: string;
    model_serialized: Cobra.Model;
    default_biomass_reaction: string;
    preferred_map_id: number;
  }
}

export interface SimulateRequest {
  model_id: number;
  method: string;
  objective_id?: string;
  objective_direction: ObjectiveDirection;
  operations: DeCaF.Operation[];
}

// Experimental conditions
// tslint:disable-next-line
declare namespace ExperimentalConditions {
  // A medium compound
  export interface Medium {
    id: string; // e.g. 'chebi:12345'
  }

  // A measurement object, used to make modifications to model based on experimental data
  export interface Measurement {
    id: string; // metabolite id (<database>:<id>, f.e. chebi:12345)
    type: 'compound' | 'reaction' | 'growth-rate' | 'protein';
    measurements: number[];
  }
}

export interface BiggSearch {
  results: Reaction[];
  results_count: number;
}

export interface BiggReaction {
  model_bigg_id?: string;
  bigg_id: string;
  name: string;
  organism?: string;
}

export interface AddedReaction extends BiggReaction {
  bigg_id: string;
  metanetx_id?: string;
  reaction_string?: string;
  // tslint:disable-next-line:no-any
  metabolites: any;
  // tslint:disable-next-line:no-any
  metabolites_to_add: any;
  database_links?: {};
  id?: string;
}

export interface Species {
  project_id: string;
  id: number;
  name: string;
  created: string;
  updated: string;
}

export interface ReactionState {
  includedInModel: boolean;
  knockout: boolean;
  knockoutGenes: boolean;
  objective: ObjectiveReactionPayload;
  bounds: {
    lowerbound: number,
    upperbound: number,
  };
}

export interface Gene {
  id: string;
  name: string;
}

export interface Experiment {
  created: string;
  description: string;
  id: number;
  name: string;
  project_id: number;
  updated: string;
}

export interface Condition {
  aerobic: boolean;
  created: string;
  experiment_id: number;
  feed_medium_id: number;
  id: number;
  medium_id: number;
  name: string;
  protocol: string;
  strain_id: number;
  temperature: number;
  updated: string;
}

export interface DataResponse {
  genotype: string[];
  growth_rate: number;
  measurements: Measurement[];
  medium: Medium[];
}

export interface Measurement {
  id: string;
  measurements: number[];
  namespace: string;
  type: string;
}

export interface Medium {
  id: string;
  namespace: string;
}
