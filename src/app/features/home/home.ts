import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Router } from '@angular/router';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { DropDownMenu } from '../../shared/components/drop-down-menu/drop-down-menu';

@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard, DropDownMenu],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  surveyService = inject(SurveyService);
  router = inject(Router);
  showActiveSurveys = signal(true);
  showPastSurveys = signal(false);

  surveysList = computed(() => {
    return this.surveyService.surveyList().filter(survey => this.isSurveyVisible(survey));
  });


  constructor() {
    effect(() => {
      if(!this.showActiveSurveys() && !this.showPastSurveys()){
        this.showActiveSurveys.set(true);
      }
    });
  }


  async ngOnInit(): Promise<void> {
    await this.surveyService.startRetrieval();
  }

  onNewSurvey(): void {
    this.router.navigate(['create']);
  }

  onFilterActiveSurveys(): void {
    this.showActiveSurveys.set(!this.showActiveSurveys());

  }

  onFilterPastSurveys(): void {
    this.showPastSurveys.set(!this.showPastSurveys());
  }

  private isSurveyVisible(survey: SurveyWithCategory): boolean {
    if(this.showActiveSurveys() && this.showPastSurveys()) {return true;}
    if(this.showActiveSurveys()) {return survey.difference_in_days >= 0;}
    if(this.showPastSurveys()) {return survey.difference_in_days < 0;}
    return false;
  }
}
