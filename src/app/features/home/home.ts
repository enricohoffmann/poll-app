import { Component, inject, OnInit } from '@angular/core';
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

  async ngOnInit(): Promise<void> {
    await this.surveyService.getSurveyWithCategory();
  }

  onNewSurvey(): void{
    this.router.navigate(['create']);
  }
  
}
