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

import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as types from '../../../app-interactive-map/types';
import {AppState} from '../../../store/app.reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddModel} from '../../store/models.actions';
import {Project} from 'src/app/projects/types';
import {MatDialog, MatSelect, MatSelectChange, MatSnackBar} from '@angular/material';
import {AddedModelComponent} from './added-model.component';
import * as actions from '../../../store/shared.actions';
import {SessionService} from '../../../session/session.service';
import {IamService} from '../../../services/iam.service';
import {WarehouseService} from '../../../services/warehouse.service';
import {NewSpecies} from '../../types';

@Component({
  selector: 'app-loader',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],

})

export class AddModelComponent implements OnInit, OnDestroy {

  @ViewChild('newproject') newProject: ElementRef;
  @ViewChild('neworganism') newOrganism: ElementRef;
  @ViewChild('neworganism_project') newOrganismProject: MatSelect;

  public allSpecies: Observable<types.Species[]>;
  public allProjects: Observable<Project[]>;
  public model: types.DeCaF.Model;
  public addModelForm: FormGroup;
  public error: Observable<Boolean>;
  public fileType = '.json';
  public reactions: string[] = [];
  public modelError = false;
  public addedModel = false;
  public loading = false;
  public project: Project = {
    id: null,
    name: '',
  };

  constructor(
    private store: Store<AppState>,
    public fb: FormBuilder,
    private dialog: MatDialog,
    private session: SessionService,
    private iamService: IamService,
    private warehouseService: WarehouseService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.allSpecies = this.store.pipe(select((store) => store.shared.allSpecies));
    this.allProjects = this.store.pipe(select((store) => store.shared.projects));
    this.error = this.store.pipe(select((store) => store.models.error));
    this.store.pipe(select((store) => store.shared.modelHeaders)).subscribe(() => {
      if (this.addedModel) {
        this.dialog.closeAll();
        this.snackBar.openFromComponent(AddedModelComponent, {
          duration: 2000,
        });
      }
    });
    this.addModelForm = this.fb.group({
      name: ['', Validators.required],
      organism_id: ['', Validators.required],
      project_id: ['', Validators.required],
      model_serialized: ['', Validators.required],
      default_biomass_reaction: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.store.dispatch(new AddModel(this.addModelForm.value));
    this.addedModel = true;
    this.loading = true;
  }

  // tslint:disable-next-line:no-any
  fileChange(event: any): void {
    if (event.target.files) {
      const fileList: FileList = event.target.files;
      const file: File = fileList[0];
      this.fileUploaded(file);
    }
  }

  fileUploaded(file: File): void {
    const fileReader = new FileReader(); // New instance fileReader
    fileReader.onload = () => {  // Called when a read operation successfully completes
      const model = JSON.parse(fileReader.result);
      this.addModelForm.patchValue({
        model_serialized: JSON.parse(fileReader.result),
      });
      if (model.reactions) {
        this.modelError = false;
        this.reactions = model.reactions.map((reaction) => reaction.id);
      } else {
        this.modelError = true;
      }
    };
    if (file) {
      fileReader.readAsText(file); // For stored the file in this.data after the 'load' event fires
    }
  }

  filterReactions(name: string): string[] {
    if (name) {
      return this.reactions.filter((s) => new RegExp(name.toLowerCase()).test(s.toLowerCase())).slice(0, 9);
    } else {
      return this.reactions.slice(0, 9);
    }
  }

  submitProject(): void {
    const project = {
      id: null,
      name: this.newProject.nativeElement.value,
    };
    this.iamService.createProject(project).subscribe(
      // Refresh the token to include the newly created project when fetching new projects
      () => this.session.refresh().subscribe(
        () => {
          this.snackBar.open(`Project ${project.name} created`, '', {
            duration: 2000,
          });
          this.store.dispatch(new actions.FetchProjects());
          this.store.pipe(select((store) => store.shared.projects)).subscribe((projects) => {
            this.addModelForm.patchValue({
              project_id: projects.slice(-1).pop().id,
            });
          });
        },
      ),
    );
  }

  submitOrganism(): void {
    const organism: NewSpecies = {
      name: this.newOrganism.nativeElement.value,
      project_id: this.newOrganismProject.value,
    };
    this.warehouseService.createOrganisms(organism).subscribe(() => {
      this.store.dispatch(new actions.FetchSpecies());
      this.store.pipe(select((store) => store.shared.allSpecies)).subscribe((species) => {
        this.addModelForm.patchValue({
          organism_id: species.slice(-1).pop().id,
        });
      });
    });
  }

  isValidProject(): boolean {
    if (this.newProject) {
      return Boolean(this.newProject.nativeElement.value);
    } else {
      return false;
    }
  }

  isValidOrganism(): boolean {
    if (this.newOrganism && this.newOrganismProject) {
      return Boolean(this.newOrganism.nativeElement.value && this.newOrganismProject.value);
    } else {
      return false;
    }
  }

  cancelProject(): void {
    this.addModelForm.patchValue({
      project_id: '',
    });
  }

  cancelOrganism(): void {
    this.addModelForm.patchValue({
      organism_id: '',
    });
  }

  ngOnDestroy(): void {
    this.addedModel = false;
    this.loading = false;
  }
}

