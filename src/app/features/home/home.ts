import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  surveyService = inject(SurveyService);
  router = inject(Router);
  showActiveSurveys = signal(true);
  showPastSurveys = signal(false);

  surveysList = computed(() => {
    if(this.showActiveSurveys() && this.showPastSurveys()){return this.surveyService.surveyList();}
    else {return this.surveyService.surveyList();}
  });


  constructor() {
    effect(() => {
      if(!this.showActiveSurveys() && !this.showPastSurveys()){
        this.showActiveSurveys.set(true);
      }
    });
  }


  async ngOnInit(): Promise<void> {
    await this.surveyService.getSurveyWithCategory();
    await this.surveyService.getSurveyHighlights();

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
}
