import { Injectable, inject, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Dialog } from '../shared/components/dialog/dialog';
import { Observable, Subject } from 'rxjs';
import { DialogResult } from '../shared/utils/types';

/**
 * @description Service for managing dialog overlays. For success dialogs, it provides a method to open a success dialog with a title. 
 * For confirmation dialogs, it provides a method to open a confirm dialog with a title and message, returning an observable that emits the user's choice (confirm or cancel).
 */
@Injectable({
  providedIn: 'root',
})
export class DialogOverlayService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private readonly closed = new Subject<void>();
  private readonly confirmResult = new Subject<DialogResult>();

  /**
   * @description Opens a success dialog with the given title.
   * @param title The title of the success dialog.
   * @returns An observable that emits when the dialog is closed.
   */
  openSuccessDialog(title: string): Observable<void> {
    this.close();
    this.overlayRef = this.createOverlay();

    const dialog = this.attachDialog();
    this.initializeSuccessDialog(dialog, title);

    return this.closed.asObservable();
  }

  /**
   * @description Opens a confirmation dialog with the given title and message.
   * @param title The title of the confirmation dialog.
   * @param message The message of the confirmation dialog.
   * @returns An observable that emits the user's choice (confirm or cancel).
   */
  openConfirmDialog(title: string, message: string): Observable<DialogResult> {
    this.close();
    this.overlayRef = this.createOverlay();

    const dialog = this.attachDialog();
    this.initializeConfirmDialog(dialog, title, message);

    return this.confirmResult.asObservable();
  }

  /**
   * @description Creates an overlay for the dialog with specific configurations such as backdrop, panel class, scroll strategy, and position strategy.
   * @returns The created overlay reference.
   */
  private createOverlay(): OverlayRef {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'dialog-panel',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .bottom('16px')
    });
  }

  /**
   * @description Attaches the Dialog component to the overlay and returns the component reference.
   * @returns The component reference of the attached Dialog component.
   */
  private attachDialog(): ComponentRef<Dialog> {
    return this.overlayRef!.attach(
      new ComponentPortal(Dialog)
    );
  }

  /**
   * @description Initializes a success dialog by setting its variant to 'success', assigning the provided title, and subscribing to the close event to handle dialog closure.
   * @param dialog The component reference of the dialog to initialize.
   * @param title The title of the success dialog.
   * @returns {void}
   */
  private initializeSuccessDialog(dialog: ComponentRef<Dialog>, title: string): void {
    dialog.setInput('dialogVariant', 'success');
    dialog.setInput('title', title);
    dialog.instance.closeEvent.subscribe(() => this.handleDialogClose());
  }

  /**
   * @description Initializes a confirmation dialog by setting its variant to 'confirm', assigning the provided title and message, 
   * and subscribing to the close, cancel, and confirm events to handle user actions.
   * @param dialog The component reference of the dialog to initialize.
   * @param title The title of the confirmation dialog.
   * @param message The message of the confirmation dialog.
   * @returns {void}
   */
  private initializeConfirmDialog(dialog: ComponentRef<Dialog>, title: string, message: string): void {
    this.setConfirmInputs(dialog, title, message);
    this.bindConfirmEvents(dialog);
  }


  /**
   * @description Sets the inputs for a confirmation dialog, including its variant, title, and message.
   * @param dialog The component reference of the dialog to set inputs for.
   * @param title The title of the confirmation dialog.
   * @param message The message of the confirmation dialog.
   * @returns {void}
   */
  private setConfirmInputs(dialog: ComponentRef<Dialog>, title: string, message: string): void {
    dialog.setInput('dialogVariant', 'confirm');
    dialog.setInput('title', title);
    dialog.setInput('message', message);
  }

  /**
   * @description Binds the close, cancel, and confirm events of a confirmation dialog to handle user actions and emit the appropriate result.
   * @param dialog The component reference of the dialog to bind events for.
   * @returns {void}
   */
  private bindConfirmEvents(dialog: ComponentRef<Dialog>): void {
    dialog.instance.closeEvent.subscribe(() => this.handleConfirmResult('cancel'));

    dialog.instance.cancelEvent.subscribe(() => this.handleConfirmResult('cancel'));

    dialog.instance.confirmEvent.subscribe(() => this.handleConfirmResult('confirm'));
  }

  /**
   * @description Handles the result of a confirmation dialog by emitting the result through the confirmResult subject and closing the dialog.
   * @param result The result of the confirmation dialog ('confirm' or 'cancel').
   * @returns {void}
   */
  private handleConfirmResult(result: DialogResult): void {
    this.confirmResult.next(result);
    this.close();
  }

  /**
   * @description Closes the currently open dialog overlay, if any, and disposes of the overlay reference.
   * @returns {void}
   */
  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  /**
   * @description Handles the closure of a dialog by emitting a closed event and closing the overlay.
   * @returns {void}
   */
  private handleDialogClose(): void {
    this.closed.next();
    this.close();
  }

}
