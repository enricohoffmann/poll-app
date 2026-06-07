import { Component, input, signal } from '@angular/core';
import { SurveyWithCategory } from '../../../interfaces/survey-with-category-interface';
import { Status } from '../status/status';

@Component({
  selector: 'app-card-highlights',
  imports: [Status],
  templateUrl: './card-highlights.html',
  styleUrl: './card-highlights.scss',
})
export class CardHighlights {
  surveyWithCategory = input<SurveyWithCategory>();
  isHover = signal(false);

  onMouseEnter(){
    this.isHover.set(true);
  }

  onMouseLeave(){
    this.isHover.set(false);
  }
}
