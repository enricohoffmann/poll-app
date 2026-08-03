import { Injectable, inject, ComponentRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Dialog } from '../shared/components/dialog/dialog';
import { Observable, Subject } from 'rxjs';
import { DialogResult } from '../shared/utils/types';

@Injectable({
  providedIn: 'root',
})
export class DialogOverlayService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;
  private readonly closed = new Subject<void>();
  private readonly confirmResult = new Subject<DialogResult>();

  openSuccessDialog(title: string): Observable<void> {
    this.close();
    this.overlayRef = this.createOverlay();

    const dialog = this.attachDialog();
    this.initializeSuccessDialog(dialog, title);

    return this.closed.asObservable();
  }

  openConfirmDialog(title: string, message: string): Observable<DialogResult> {
    this.close();
    this.overlayRef = this.createOverlay();

    const dialog = this.attachDialog();
    this.initializeConfirmDialog(dialog, title, message);

    return this.confirmResult.asObservable();
  }

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

  private attachDialog(): ComponentRef<Dialog> {
    return this.overlayRef!.attach(
      new ComponentPortal(Dialog)
    );
  }

  private initializeSuccessDialog(dialog: ComponentRef<Dialog>, title: string): void {
    dialog.setInput('dialogVariant', 'success');
    dialog.setInput('title', title);
    dialog.instance.closeEvent.subscribe(() => this.handleDialogClose());
  }

  private initializeConfirmDialog(
    dialog: ComponentRef<Dialog>,
    title: string,
    message: string
  ): void {
    this.setConfirmInputs(dialog, title, message);
    this.bindConfirmEvents(dialog);
  }

  private setConfirmInputs(
    dialog: ComponentRef<Dialog>,
    title: string,
    message: string
  ): void {
    dialog.setInput('dialogVariant', 'confirm');
    dialog.setInput('title', title);
    dialog.setInput('message', message);
  }

  private bindConfirmEvents(dialog: ComponentRef<Dialog>): void {
    dialog.instance.closeEvent.subscribe(() =>
      this.handleConfirmResult('cancel')
    );

    dialog.instance.cancelEvent.subscribe(() =>
      this.handleConfirmResult('cancel')
    );

    dialog.instance.confirmEvent.subscribe(() =>
      this.handleConfirmResult('confirm')
    );
  }

  private handleConfirmResult(result: DialogResult): void {
    this.confirmResult.next(result);
    this.close();
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }

  private handleDialogClose(): void {
    this.closed.next();
    this.close();
  }

}
