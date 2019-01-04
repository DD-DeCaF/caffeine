import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/app.reducers';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import * as actions from '../store/shared.actions';
import {DesignRequest} from './types';
import {DeleteDesignComponent} from './components/delete-design/delete-design.component';
import {AddCard} from '../app-interactive-map/store/interactive-map.actions';
import {CardType} from '../app-interactive-map/types';
import {Router} from '@angular/router';
import {DesignsAddedComponent} from './components/designs-added/designs-added.component';

@Component({
  selector: 'app-designs',
  templateUrl: './app-designs.component.html',
  styleUrls: ['./app-designs.component.scss'],
})
export class AppDesignsComponent implements OnInit {
  public dataSource = new MatTableDataSource<DesignRequest>([]);
  public designs: DesignRequest[] = [];
  private cardAdded = false;
  private counterCardAdded = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = [
    'select',
    'id',
    'name',
    'actions',
  ];

  constructor(
    private store: Store<AppState>,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.store.pipe(select((store) => store.shared.designs)).subscribe((designs) => {
      this.dataSource.data = designs;
    });
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteDesign(design: DesignRequest): void {
    this.dialog.open(DeleteDesignComponent, {
      data: design,
    });
  }

  addDesign(design: DesignRequest): void {
    if (this.designs.includes(design)) {
      this.designs = this.designs.filter((d) => d.id !== design.id);
    } else {
      this.designs.push(design);
    }
  }

  addCards(): void {
    this.store.pipe(select((store) => store.interactiveMap.cards)).subscribe((cards) => {
      console.log('CARDS', cards);
      if (this.cardAdded) {
        if (this.designs.length > 0) {
          this.store.dispatch(new AddCard(CardType.Design, this.designs.pop()));
          this.counterCardAdded = this.counterCardAdded + 1;
        } else {
          console.log('COUNTER', this.counterCardAdded);
          this.cardAdded = false;
        }
      }
    });
    if (!this.cardAdded) {
      if (this.designs.length > 0) {
        this.store.dispatch(new AddCard(CardType.Design, this.designs.pop()));
        this.cardAdded = true;
        this.counterCardAdded = this.counterCardAdded + 1;
      }
    }
  }
}
