import { NgClass } from '@angular/common';
import { Component, output, signal } from '@angular/core';

/**
 * @description Component for displaying the result accordion in the poll.
 */
@Component({
  selector: 'app-result-accordeon',
  imports: [NgClass],
  templateUrl: './result-accordeon.html',
  styleUrls: ['./result-accordeon.scss'],
})
export class ResultAccordeon {
  seeResult = signal<boolean>(false);
  seeResultEvent = output<boolean>();

  /**
   * @description Toggles the visibility of the result accordion and emits an event with the new state.
   * @returns void  
   */
  toggleSee(): void {
    this.seeResult.set(!this.seeResult());
    this.seeResultEvent.emit(this.seeResult());
  }

}
