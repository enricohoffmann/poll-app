import { Component, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  dialogCloseEvent = output();

  onDialogClose(): void {
    this.dialogCloseEvent.emit();
  }
}
