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

import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Job, PathwayPredictionReactions, PathwayPredictionResult, PathwayResponse, PathwayPredictionMetabolites} from '../../types';
import {Observable, Subscription, timer} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../store/app.reducers';
import {getJob} from '../../store/jobs.selectors';
import {selectNotNull} from '../../../framework-extensions';
import {NinjaService} from '../../../services/ninja-service';
import {getModelName, getOrganismName} from '../../../store/shared.selectors';
import {DeCaF} from 'src/app/app-interactive-map/types';


@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.scss'],
})
export class JobDetailComponent implements OnInit, OnDestroy {
  public job: PathwayResponse;
  modelName$: Observable<string>;
  organismName$: Observable<string>;
  model: DeCaF.Model;
  loadError = false;
  // @ts-ignore
  public tableData: PathwayPredictionResult[];
  public reactionsData: PathwayPredictionReactions;
  public metabolitesData: PathwayPredictionMetabolites;
  polling: Subscription;
  public jobId: number;
  private getJob: Subscription;
  private updateJob: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private ninjaService: NinjaService,
    private cdr: ChangeDetectorRef,
  ) {
    this.jobId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    const jobId = this.route.snapshot.params.id;
    this.getJob = this.store.pipe(selectNotNull(getJob, {jobId}))
      .subscribe((job) => {
        this.job = job;
        this.model = job.model;
        this.modelName$ = this.store.pipe(
          select(getModelName(job.model_id)));
        this.organismName$ = this.store.pipe(
          select(getOrganismName(job.organism_id)));
        if (!this.cdr['destroyed']) {
          this.cdr.detectChanges();
        }
      });

    this.polling = timer(0, 20000)
      .subscribe(() => {
        this.updateJob = this.ninjaService.getPredict(jobId).subscribe((jobPrediction: PathwayResponse) => {
          this.job = jobPrediction;
          if (jobPrediction.result) {
            this.tableData = [...jobPrediction.result.cofactor_swap, ...jobPrediction.result.diff_fva, ...jobPrediction.result.opt_gene];
            this.reactionsData = jobPrediction.result.reactions;
            this.metabolitesData = jobPrediction.result.metabolites;
            this.polling.unsubscribe();
          } else if (jobPrediction.status === 'FAILURE') {
            this.polling.unsubscribe();
          }
          if (!this.cdr['destroyed']) {
            this.cdr.detectChanges();
          }
        });
      });
  }

  public abort(job: Job): void {
    // TODO: use mat-dialog https://material.angular.io/components/dialog/overview
    if (!confirm(`Are you sure you wish to abort job ${job.id}: ${job.data.type}?`)) {
      return;
    }
    console.log(`Cancel job: ${job.id}`);
  }

  ngOnDestroy(): void {
    this.polling.unsubscribe();
    if (this.getJob) {
      this.getJob.unsubscribe();
    }
    if (this.updateJob) {
      this.updateJob.unsubscribe();
    }
  }
}
