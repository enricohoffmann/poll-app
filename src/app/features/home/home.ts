import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { SurveyService } from '../../services/survey-service';
import { SurveyCard } from '../../shared/components/survey-card/survey-card';

@Component({
  selector: 'app-home',
  imports: [Header, Button, SurveyCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  surveyService = inject(SurveyService);

  async ngOnInit(): Promise<void> {
    await this.surveyService.getSurveyWithCategory();
  }
  
}
