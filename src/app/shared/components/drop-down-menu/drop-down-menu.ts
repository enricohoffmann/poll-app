import { Component, inject } from '@angular/core';
import { SurveyService } from '../../../services/survey-service';

@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrl: './drop-down-menu.scss',
})
export class DropDownMenu {
  surveyService = inject(SurveyService);

  ngOnInit(): void {
    this.surveyService.getCategories();
  }
}
