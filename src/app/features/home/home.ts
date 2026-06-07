import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { Button } from '../../shared/components/button/button';
import { CardHighlights } from '../../shared/components/card-highlights/card-highlights';
import { SurveyService } from '../../services/survey-service';

@Component({
  selector: 'app-home',
  imports: [Header, Button, CardHighlights],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  surveyService = inject(SurveyService);

  async ngOnInit(): Promise<void> {
    await this.surveyService.getSurveyWithCategory();
  }
  
}
