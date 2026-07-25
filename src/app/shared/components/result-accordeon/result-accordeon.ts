import { NgClass } from '@angular/common';
import { Component, output, signal } from '@angular/core';


@Component({
  selector: 'app-result-accordeon',
  imports: [NgClass],
  templateUrl: './result-accordeon.html',
  styleUrl: './result-accordeon.scss',
})
export class ResultAccordeon {
  seeResult = signal<boolean>(false);
  seeResultEvent = output<boolean>();

  toggleSee(): void {
    this.seeResult.set(!this.seeResult());
    this.seeResultEvent.emit(this.seeResult());
  }


}
