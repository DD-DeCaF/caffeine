import {Directive, HostListener, HostBinding} from '@angular/core';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {MatDialog, MatDialogConfig} from '@angular/material';

@Directive({
  selector: '[appOpenLoginDialog]',
})
export class OpenLoginDialogDirective {
  @HostBinding('style.cursor') cursor = 'pointer';
  @HostListener('click', ['$event']) onClick($event: Event): void {
    this.openDialog();
  }

  constructor(private dialog: MatDialog) {}

  public openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(LoginDialogComponent, dialogConfig);
  }
}