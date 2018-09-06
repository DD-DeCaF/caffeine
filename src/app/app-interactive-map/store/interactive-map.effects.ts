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
import { Action, Store, select} from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, combineLatest } from 'rxjs';
import {withLatestFrom, map, mapTo, delay, filter, switchMap, concatMapTo, take} from 'rxjs/operators';
import { AppState } from '../../store/app.reducers';

import * as fromActions from './interactive-map.actions';
import { environment } from '../../../environments/environment.staging';
import * as types from '../types';
import { PathwayMap } from '@dd-decaf/escher';
import { interactiveMapReducer } from './interactive-map.reducers';
import { SimulationService } from '../services/simulation.service';
import { MapService } from '../services/map.service';


const ACTION_OFFSETS = {
  [fromActions.NEXT_CARD]: 1,
  [fromActions.PREVIOUS_CARD]: -1,
};

const preferredMapItem = {
  model: 'iJO1366',
  name : 'Central metabolism',
};

const preferredSpeciesList = [
  'Escherichia coli',
];

const preferredMapsByModel = {
  'iJO1366': 'Central metabolism',
  'e_coli_core': 'Central metabolism',
  'iJN746': 'Central metabolism',
  'iMM904': 'Central metabolism',
};

const preferredSelector = <T>(
  predicate: (item: T) => boolean,
  preferredMap?: (item: T) => boolean,
  modelHasMaps?: (item: T) => boolean,
) => (items: T[]): T =>
  items.find(predicate) || (items.find(modelHasMaps) || (items.find(preferredMap) ||
  items[0]));


const preferredSpecies = preferredSelector((species: types.Species) =>
  preferredSpeciesList.includes(species.name));

const addedReactionToReaction = ({
  bigg_id,
  metanetx_id,
  reaction_string,
  database_links,
  model_bigg_id,
  organism,
  ...rest}: types.AddedReaction,
  bounds: {lowerBound?: number, upperBound?: number}= {lowerBound: null, upperBound: null}): types.Cobra.Reaction =>
  ({
    ...rest,
    id: bigg_id,
    gene_reaction_rule: reaction_string,
    lower_bound: bounds.lowerBound,
    upper_bound: bounds.upperBound,
});

@Injectable()
export class InteractiveMapEffects {
  @Effect()
  fetchSpecies: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_SPECIES),
    switchMap(() => {
      return this.http.get(`${environment.apis.warehouse}/organisms`);
    }),
    map((payload: types.Species[]) => new fromActions.SetSpecies(payload)),
  );

  @Effect()
  setSpecies: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_SPECIES),
    map((action: fromActions.SetSpecies) => new fromActions.SetSelectedSpecies(preferredSpecies(action.payload))));

  @Effect()
  fetchModels: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MODELS),
    switchMap(() =>
      this.http.get(`${environment.apis.model_warehouse}/models`)),
    map((models: types.DeCaF.Model[]) => new fromActions.SetModels(models)),
  );

// TODO set model according to selectedSpecies
  @Effect()
  selectFirstModel: Observable<Action> = combineLatest(
    this.actions$.pipe(ofType(fromActions.FETCH_SPECIES)),
    this.actions$.pipe(ofType(fromActions.SET_SELECTED_SPECIES)),
    this.actions$.pipe(ofType(fromActions.SET_MODELS)),
  ).pipe(
    map(([a, {payload: {id: selectedOrgId}}, {payload: models}]: [never, fromActions.SetSelectedSpecies, fromActions.SetModels]) => {
      const selectedModel = models
        .filter((model) => model.organism_id === selectedOrgId.toString())[0];
      return new fromActions.SetModel(selectedModel);
    }),
  );

  @Effect()
  setMaps: Observable<Action> = combineLatest(
    this.actions$.pipe(
      ofType(fromActions.SET_MODEL)),
    this.actions$.pipe(
      ofType(fromActions.SET_MAPS),
      take(1),
    ),
  ).pipe(
    map(([action]) => action),
    withLatestFrom(this.store$),
    map(([action, storeState]: [fromActions.SetModel, AppState]) => {
      const model = action.payload;
      const {maps} = storeState.interactiveMap;
      const modelHasMaps = (mapItem: types.MapItem) =>
        (mapItem.model === model.name);
      const preferredMap = (mapItem: types.MapItem) =>
        (mapItem.model === preferredMapItem.model && mapItem.name === preferredMapItem.name);
      const predicate = (mapItem: types.MapItem) =>
        (mapItem.model === model.name && mapItem.name === preferredMapsByModel[model.name]);
      return new fromActions.SetMap(preferredSelector(predicate, preferredMap, modelHasMaps)(maps));
    }),
  );

  @Effect()
  fetchMaps: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.FETCH_MAPS),
    switchMap(() =>
      this.mapService.loadMaps()),
    map((maps: types.MapItem[]) => new fromActions.SetMaps(maps)),
  );

  @Effect()
  resetCards: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_MODEL),
    concatMapTo([
      new fromActions.ResetCards(),
      new fromActions.AddCard(types.CardType.WildType),
    ]),
  );

  @Effect()
  simulateNewCard: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_CARD),
    withLatestFrom(this.store$.pipe(select((store) => store.interactiveMap.selectedModel))),
    switchMap(([{payload: type}, model]: [fromActions.AddCard, types.DeCaF.Model]) => {
      const payload: types.SimulateRequest = {
        model: model.model_serialized,
        biomass_reaction: model.default_biomass_reaction,
        method: 'fba',
        objective: null,
        objective_direction: null,
        operations: [],
      };
      return this.simulationSerivce.simulate(payload)
        .pipe(
          map((solution) => ({
            type,
            solution,
          })),
        );
    }),
    map((data) => new fromActions.AddCardFetched(data)),
  );

  @Effect()
  fetchMap: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_MAP),
    switchMap((action: fromActions.SetMap) => {
      return this
        .http.get(`${environment.apis.map}/map?map=${action.payload.map}`)
        .pipe(map((response: PathwayMap) => ({
          mapData: response,
          mapItem: action.payload,
        })),
      );
    }),
    map(({mapData, mapItem}) => new fromActions.MapFetched({mapData, mapItem})),
  );

  // Steps to the previous or the next card depending on the action
  // handles overflow / underflow
  @Effect()
  cardStepper: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.NEXT_CARD, fromActions.PREVIOUS_CARD),
    withLatestFrom(this.store$),
    map(([action, storeState]) => {
      const {interactiveMap} = storeState;
      const {ids} = interactiveMap.cards;
      const {length} = ids;
      const index = ids.findIndex((id) => interactiveMap.selectedCardId === id);

      const newIndex = (length + index + ACTION_OFFSETS[action.type]) % length;
      return new fromActions.SelectCard(ids[newIndex]);
    }),
  );

  // Switch to the next card if play was paused
  @Effect()
  initPlay: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_PLAY_STATE),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    mapTo(new fromActions.NextCard()),
  );

  // If the card is loaded and playing is enabled, switch to the new one.
  // Perhaps a little delay should be introduced
  @Effect()
  stepNextIfPlaying: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOADED),
    withLatestFrom(this.store$),
    filter(([, storeState]) => storeState.interactiveMap.playing),
    delay(700),
    mapTo(new fromActions.NextCard()),
  );

  @Effect()
  operationReaction: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SET_METHOD, fromActions.REACTION_OPERATION, fromActions.SET_OBJECTIVE_REACTION),
    withLatestFrom(this.store$),
    switchMap(([action, store]: [fromActions.OperationAction, AppState]) => {
      // Ugly hack not to implement the reduction twice.
      // @ts-ignore
      const newAction = new fromActions.operationToApply[action.type](action.payload);
      const IMStore = interactiveMapReducer(store.interactiveMap, newAction);
      const selectedCard = IMStore.cards.cardsById[IMStore.selectedCardId];

      const addedReactions = selectedCard.addedReactions.map((reaction: types.AddedReaction): types.DeCaF.Operation => ({
        operation: 'add',
        type: 'reaction',
        id: reaction.bigg_id,
        data: addedReactionToReaction(reaction),
      }));

      const knockouts = selectedCard.knockoutReactions.map((reactionId: string): types.DeCaF.Operation => ({
        operation: 'knockout',
        type: 'reaction',
        id: reactionId,
        data: null,
      }));

      const bounds = selectedCard.bounds.map(({reaction, lowerBound, upperBound}: types.Bound): types.DeCaF.Operation => ({
        operation: 'modify',
        type: 'reaction',
        id: reaction.id,
        data: {
          ...reaction,
          lower_bound: lowerBound,
          upper_bound: upperBound,
        },
      }));

      const payload: types.SimulateRequest = {
        model: store.interactiveMap.selectedModel.model_serialized,
        biomass_reaction: store.interactiveMap.selectedModel.default_biomass_reaction,
        method: selectedCard.method,
        objective_direction: selectedCard.objectiveReaction ? selectedCard.objectiveReaction.direction : null,
        objective: selectedCard.objectiveReaction ? selectedCard.objectiveReaction.reactionId : null,
        operations: [
          ...addedReactions,
          ...knockouts,
          ...bounds,
        ],
      };
      return this.simulationSerivce.simulate(payload)
        .pipe(map((solution: types.DeCaF.Solution) => ({
          action: newAction,
          solution,
        })));
    }),
    map(({action, solution}) => ({
        ...action,
        solution,
    })),
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private http: HttpClient,
    private mapService: MapService,
    private simulationSerivce: SimulationService,
  ) {}
}
