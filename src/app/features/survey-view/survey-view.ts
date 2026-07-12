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

@Component({
  selector: 'app-survey-view',
  imports: [Header, Status, Button, IsoDateToGerman, QuestionView],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView {
  private readonly activatedRoute = inject(ActivatedRoute);
  surveyId = 0;
  private readonly surveyService = inject(SurveyService);
  survey = signal<SurveyWithCategory | null>(null);
  questionsAndAnswers = signal<QuestionWithAnswers[]>([]);

  voteForm = new FormGroup({
    questions: new FormArray<FormGroup>([])
  });

  async ngOnInit(): Promise<void> {
    const surveyIdParam = this.activatedRoute.snapshot.paramMap.get('surveyId');
    this.surveyId = Number(surveyIdParam);
    await this.getDataFromDb();
    this.createQuestionFormArray();
    
    console.log(this.voteForm);
    

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

  private createQuestionFormGroup(question: QuestionWithAnswers): FormGroup {

    const answers = this.fillAnswers(question.answers);

    return new FormGroup({
      id: new FormControl(question.id, {nonNullable: true}),
      text: new FormControl(question.text, {nonNullable: true}),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, {nonNullable: true}),
      sort: new FormControl(question.sort_order, {nonNullable: true}),
      answers
    });

  }

  private fillAnswers(answers: Answer[]): FormArray<FormGroup> {
    const answersFormArray = new FormArray<FormGroup>([]);

    for(let aIndex = 0; aIndex < answers.length; aIndex++) {
      answersFormArray.push(this.createAnswerFormGroup(answers[aIndex]));
    }
    
    return answersFormArray;
  }

  private createAnswerFormGroup(answer: Answer): FormGroup {
    const answerVoting: AnswerVoting = {...answer, selected: false};
    return new FormGroup ({
      answerId: new FormControl(answerVoting.id),
      sort: new FormControl(answerVoting.sort_order),
      answerText: new FormControl(answerVoting.text),
      select: new FormControl(answerVoting.selected)
    });

  }

}
