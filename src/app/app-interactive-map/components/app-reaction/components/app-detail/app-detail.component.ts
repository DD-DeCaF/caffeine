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

import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {Cobra, AddedReaction} from 'src/app/app-interactive-map/types';

@Component({
  selector: 'app-detail',
  templateUrl: './app-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AppDetailComponent {
  // tslint:disable-next-line:no-any
  @Input() public items: any[] = [];
  // tslint:disable-next-line:no-any
  @Input() public display: (item: any) => string;
  @Input() private model: Cobra.Model;
  @Input() private type: string;
  @Output() public remove = new EventEmitter<string>();

  getItemName(item: AddedReaction | string): string {
    if (this.type === 'added_reactions') {
      return item['name'];
    }
    if (this.type === 'reactions') {
      return this.model.reactions.find((reaction) => reaction.id === item).name;
    }
    return this.model.genes.find((gene) => gene.id === item).name;
  }

  // tslint:disable-next-line:no-any
  displayFn(item: any): string {
    if (this.display) {
      return this.display(item);
    } else {
      return item;
    }
  }

  removeItem(item: string): void {
    this.remove.emit(item);
  }
}
