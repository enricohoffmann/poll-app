import { Component, input, signal } from '@angular/core';
import { SurveyWithCategory } from '../../../interfaces/survey-with-category-interface';
import { Status } from '../status/status';
import { SurveyCardVariant } from '../../utils/types';
import { NgClass } from '@angular/common';
import { ExpiryViewChange } from '../../../pips/custom-pips';

/**
 * @description SurveyCard component is used to display a survey card with its details and status.
 */
@Component({
  selector: 'app-survey-card',
  imports: [Status, NgClass, ExpiryViewChange],
  templateUrl: './survey-card.html',
  styleUrls: ['./survey-card.scss'],
})
export class SurveyCard {
  surveyWithCategory = input<SurveyWithCategory>();
  isHover = signal(false);
  cardVariant = input<SurveyCardVariant>();

  /**
   * @description Handles the mouse enter event on the survey card, setting the hover state to true.
   * @returns {void}
   */
  onMouseEnter(): void {
    this.isHover.set(true);
  }

  /**
   * @description Handles the mouse leave event on the survey card, setting the hover state to false.
   * @returns {void}
   */
  onMouseLeave(): void {
    this.isHover.set(false);
  }
}
