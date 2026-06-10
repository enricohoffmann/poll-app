import { Component, input, signal } from '@angular/core';
import { SurveyWithCategory } from '../../../interfaces/survey-with-category-interface';
import { Status } from '../status/status';
import { SurveyCardVariant } from '../../utils/types';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-survey-card',
  imports: [Status, NgClass],
  templateUrl: './survey-card.html',
  styleUrl: './survey-card.scss',
})
export class SurveyCard {
  surveyWithCategory = input<SurveyWithCategory>();
  isHover = signal(false);
  cardVariant = input<SurveyCardVariant>()

  onMouseEnter(){
    this.isHover.set(true);
  }

  onMouseLeave(){
    this.isHover.set(false);
  }
}
