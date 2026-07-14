import { Component, inject, signal } from '@angular/core';
import { Header } from '../../layout/header/header';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey-service';
import { Survey } from '../../interfaces/survey-interface';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../../interfaces/question-with-answers-interface';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { IsoDateToGerman } from '../../pips/custom-pips';
import { QuestionView } from '../../shared/components/question-view/question-view';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Answer } from '../../interfaces/answer-interface';
import { AnswerVoting } from '../../interfaces/answer-voting-interface';
import { AnswerForm, QuestionForm, VoteFrom } from '../../shared/utils/types';

@Component({
  selector: 'app-survey-view',
  imports: [Header, Status, Button, IsoDateToGerman, QuestionView, ReactiveFormsModule],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private readonly activatedRoute = inject(ActivatedRoute);
  surveyId = 0;
  private readonly surveyService = inject(SurveyService);
  survey = signal<SurveyWithCategory | null>(null);
  questionsAndAnswers = signal<QuestionWithAnswers[]>([]);

  voteForm = new FormGroup<VoteFrom>({
    questions: new FormArray<FormGroup<QuestionForm>>([])
  });

  async ngOnInit(): Promise<void> {
    const surveyIdParam = this.activatedRoute.snapshot.paramMap.get('surveyId');
    this.surveyId = Number(surveyIdParam);
    await this.getDataFromDb();
    this.createQuestionFormArray();
  }

  private async getDataFromDb(): Promise<void> {
    await Promise.all([
      this.readSurveyById(),
      this.readQuestionAndAnswers()
    ]);
  }

  private async readSurveyById(): Promise<void> {
    const surveyResponse = await this.surveyService.getSurveyById(this.surveyId);
    if(surveyResponse) {
      if(surveyResponse.description && surveyResponse.description.length <= 4){surveyResponse.description = null;}
      this.survey.set(surveyResponse);
    }
  }

  private async readQuestionAndAnswers(): Promise<void> {
    const responseData = await this.surveyService.getQuestionsWithAnswersBySurveyId(this.surveyId);
    if(responseData){
      this.questionsAndAnswers.set(responseData);
    }
  }

  private createQuestionFormArray(): void {
    const questionFormArray = this.voteForm.controls['questions'] as FormArray;
    for(let qIndex = 0; qIndex < this.questionsAndAnswers().length; qIndex++){
      questionFormArray.push(this.createQuestionFormGroup(this.questionsAndAnswers()[qIndex]));
    }
  }

  private createQuestionFormGroup(question: QuestionWithAnswers): FormGroup<QuestionForm> {

    return new FormGroup<QuestionForm>({
      id: new FormControl(question.id, {nonNullable: true}),
      text: new FormControl(question.text, {nonNullable: true}),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, {nonNullable: true}),
      sort: new FormControl(question.sort_order, {nonNullable: true}),
      answers: this.fillAnswers(question.answers)
    });

  }

  private fillAnswers(answers: Answer[]): FormArray<FormGroup<AnswerForm>> {
    const answersFormArray = new FormArray<FormGroup<AnswerForm>>([]);

    for(let aIndex = 0; aIndex < answers.length; aIndex++) {
      answersFormArray.push(this.createAnswerFormGroup(answers[aIndex]));
    }
    
    return answersFormArray;
  }

  private createAnswerFormGroup(answer: Answer): FormGroup<AnswerForm> {
    return new FormGroup<AnswerForm> ({
      answerId: new FormControl(answer.id, {nonNullable: true}),
      sort: new FormControl(answer.sort_order, {nonNullable: true}),
      answerText: new FormControl(answer.text, { nonNullable: true}),
      select: new FormControl(false, {nonNullable: true})
    });

  }

  onSubmit(): void {

  }


}
