import { Component, inject, signal } from '@angular/core';
import { Header } from '../../layout/header/header';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey-service';
import { Survey } from '../../interfaces/survey-interface';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../../interfaces/question-with-answers-interface';

@Component({
  selector: 'app-survey-view',
  imports: [Header],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private readonly activatedRoute = inject(ActivatedRoute);
  surveyId = 0;
  private readonly surveyService = inject(SurveyService);
  survey = signal<SurveyWithCategory | null>(null);
  questionsAndAnswers = signal<QuestionWithAnswers[]>([]);

  async ngOnInit(): Promise<void> {
    const surveyIdParam = this.activatedRoute.snapshot.paramMap.get('surveyId');
    this.surveyId = Number(surveyIdParam);
    await this.readSurveyById();
    await this.readQuestionAndAnswers();
    console.log(this.survey());
    console.log(this.questionsAndAnswers());
    
    

  }

  private async readSurveyById(): Promise<void> {
    const surveyResponse = await this.surveyService.getSurveyById(this.surveyId);
    if(surveyResponse) {
      this.survey.set(surveyResponse);
    }
  }

  private async readQuestionAndAnswers(): Promise<void> {
    const responseData = await this.surveyService.getQuestionsWithAnswersBySurveyId(this.surveyId);
    if(responseData){
      this.questionsAndAnswers.set(responseData);
    }
  }
}
