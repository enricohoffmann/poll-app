import { Component, output } from '@angular/core';

/**
 * @description A reusable dialog component.
 */
@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  dialogCloseEvent = output();

  /**
   * @description Emits an event when the dialog is closed.
   */
  onDialogClose(): void {
    this.dialogCloseEvent.emit();
  }
}
