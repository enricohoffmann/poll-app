import { Component, output } from '@angular/core';

@Component({
  selector: 'app-create-survey-modal',
  imports: [],
  templateUrl: './create-survey-modal.html',
  styleUrl: './create-survey-modal.scss',
})
export class CreateSurveyModal {
  requestClose = output<void>();

  onOverlayClick(): void {
    this.requestClose.emit();
  }

  onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
