import { Component, output, input } from '@angular/core';
import { Button } from '../button/button';

/**
 * @description A reusable dialog component.
 */
@Component({
  selector: 'app-dialog',
  imports: [Button],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  dialogVariant = input<'success' | 'confirm'>('success');

  title = input<string>('');
  message = input<string>('');

  closeEvent = output<void>();
  confirmEvent = output<void>();
  cancelEvent = output<void>();

  /**
   * @description Emits an event when the dialog is closed.
   */
  onDialogClose(): void {
    this.closeEvent.emit();
  }
}
