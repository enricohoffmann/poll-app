import { Component, output } from '@angular/core';

/**
 * @description Component for the create survey modal. Handles opening and closing of the modal.
 */
@Component({
  selector: 'app-create-survey-modal',
  imports: [],
  templateUrl: './create-survey-modal.html',
  styleUrls: ['./create-survey-modal.scss'],
})
export class CreateSurveyModal {
  requestClose = output<void>();

  /**
   * @description Emits a request to close the modal when the overlay is clicked.
   * @returns {void}
   */
  onOverlayClick(): void {
    this.requestClose.emit();
  }

  /**
   * @description Stops the click event from propagating when the content of the modal is clicked, preventing the modal from closing.
   * @param event The mouse event triggered by clicking on the modal content.
   * @returns {void}
   */
  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
