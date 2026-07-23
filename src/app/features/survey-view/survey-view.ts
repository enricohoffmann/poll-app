import { Component, inject, signal, computed, OnDestroy, OnInit } from '@angular/core';
import { Header } from '../../layout/header/header';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../services/survey-service';
import { SurveyWithCategory } from '../../interfaces/survey-with-category-interface';
import { QuestionWithAnswers } from '../../interfaces/question-with-answers-interface';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { IsoDateToGerman } from '../../pips/custom-pips';
import { QuestionView } from '../../shared/components/question-view/question-view';
import { FormGroup, ReactiveFormsModule, FormControl, FormArray } from '@angular/forms';
import { Answer } from '../../interfaces/answer-interface';
import { AnswerForm, QuestionForm, VoteFrom } from '../../shared/utils/types';
import { QuestionVote } from '../../shared/components/question-vote/question-vote';
import { questionAnsweredValidator } from '../../shared/utils/validators';
import { Vote } from '../../interfaces/vote-interface';

@Component({
  selector: 'app-survey-view',
  imports: [
    Header,
    Status,
    Button,
    IsoDateToGerman,
    QuestionView,
    ReactiveFormsModule,
    QuestionVote
  ],
  templateUrl: './survey-view.html',
  styleUrl: './survey-view.scss',
})
export class SurveyView implements OnDestroy, OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  surveyId = 0;
  private readonly surveyService = inject(SurveyService);
  survey = signal<SurveyWithCategory | null>(null);
  questionsAndAnswers = signal<QuestionWithAnswers[]>([]);
  isLoading = signal<boolean>(true);
  hasSubmitted = signal<boolean>(false);

  readonly votes = this.surveyService.voteList;

  voteForm = new FormGroup<VoteFrom>({
    questions: new FormArray<FormGroup<QuestionForm>>([])
  });

  async ngOnInit(): Promise<void> {
    const surveyIdParam = this.activatedRoute.snapshot.paramMap.get('surveyId');
    this.surveyId = Number(surveyIdParam);
    this.initializeSurveyView();
  }

  ngOnDestroy(): void {
    this.surveyService.clearCurrentQuestionIds();
  }

  private async initializeSurveyView(): Promise<void> {
    try {
      const [survey, questions] = await Promise.all([
        this.surveyService.getSurveyById(this.surveyId),
        this.surveyService.getQuestionsWithAnswersBySurveyId(this.surveyId)
      ]);

      this.survey.set(survey);
      this.questionsAndAnswers.set(questions);
      this.createQuestionFormArray(questions);
      await this.initializeVotes(questions);

    } finally { this.isLoading.set(false); }
  }

  private createQuestionFormArray(questions: QuestionWithAnswers[]): void {
    const questionFormArray = this.voteForm.controls.questions;
    questionFormArray.clear();
    for (const question of questions) {
      questionFormArray.push(this.createQuestionFormGroup(question));
    }
  }

  private async initializeVotes(questions: QuestionWithAnswers[]): Promise<void> {
    this.surveyService.setCurrentQuestionIds(this.getQuestionIds(questions));
    await this.surveyService.loadVotesByQuestionIds();
  }

  private getQuestionIds(questions: QuestionWithAnswers[]): number[] {
    return questions.map(question => question.id);
  }

  private createQuestionFormGroup(question: QuestionWithAnswers): FormGroup<QuestionForm> {

    return new FormGroup<QuestionForm>({
      id: new FormControl(question.id, { nonNullable: true }),
      text: new FormControl(question.text, { nonNullable: true }),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, { nonNullable: true }),
      sort: new FormControl(question.sort_order, { nonNullable: true }),
      answers: this.fillAnswers(question.answers)
    }, { validators: questionAnsweredValidator() });

  }

  private fillAnswers(answers: Answer[]): FormArray<FormGroup<AnswerForm>> {
    const answersFormArray = new FormArray<FormGroup<AnswerForm>>([]);

    for (let aIndex = 0; aIndex < answers.length; aIndex++) {
      answersFormArray.push(this.createAnswerFormGroup(answers[aIndex]));
    }

    return answersFormArray;
  }

  private createAnswerFormGroup(answer: Answer): FormGroup<AnswerForm> {
    return new FormGroup<AnswerForm>({
      answerId: new FormControl(answer.id, { nonNullable: true }),
      sort: new FormControl(answer.sort_order, { nonNullable: true }),
      answerText: new FormControl(answer.text, { nonNullable: true }),
      select: new FormControl(false, { nonNullable: true })
    });

  }

  get leftQuestions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls.filter(
      (_, index) => index % 2 === 0
    );
  }

  get rightQuestions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls.filter(
      (_, index) => index % 2 === 1
    );
  }

  get questions(): FormGroup<QuestionForm>[] {
    return this.voteForm.controls.questions.controls;
  }

  async onSubmit(): Promise<void> {
    if (this.hasSubmitted()) { return; }

    this.voteForm.markAllAsTouched();

    if (this.voteForm.valid) {
      const result = await this.surveyService.handleAddVotes(this.voteForm);
      this.hasSubmitted.set(true);
    }
  }


}
