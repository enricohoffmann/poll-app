import { Component, inject, signal, computed } from '@angular/core';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { InputField } from '../../shared/components/input-field/input-field';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/question-interface';
import { Answer } from '../../interfaces/answer-interface';
import { QuestionCreate } from '../../shared/components/question-create/question-create';
import { SurveyService } from '../../services/survey-service';
import { DropDownMenu } from "../../shared/components/drop-down-menu/drop-down-menu";
import { Category } from '../../interfaces/category-interface';
import { DateField } from '../../shared/components/date-field/date-field';
import { Router } from '@angular/router';
import { Dialog } from '../../shared/components/dialog/dialog';
import { categorySelectedValidator, expiresDateNotPastValidator, expiresDatePatternValidator, expiresDateValidator } from '../../shared/utils/validators';
import { ValidationService } from '../../services/validation-service';
import { Header } from "../../layout/header/header";
import { AnswerForm, QuestionForm, SurveyForm } from '../../shared/utils/types';

@Component({
  selector: 'app-survey-create',
  imports: [
    Status,
    Button,
    InputField,
    ReactiveFormsModule,
    QuestionCreate,
    DropDownMenu,
    DateField,
    Dialog,
    Header
],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {

  private readonly DIALOG_DELAY = 125;
  private readonly OVERLAY_CLOSE_DELAY = 1600;

  currentCategory = signal<Category | null>(null);

  surveyForm = new FormGroup<SurveyForm>({
    id: new FormControl(0, {nonNullable: true}),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(300)] }),
    expires_at: new FormControl('', { nonNullable: true, validators: [expiresDatePatternValidator(), expiresDateValidator(), expiresDateNotPastValidator()] }),
    questions: new FormArray<FormGroup>([]),
    is_published: new FormControl(false, {nonNullable: true}),
    category_id: new FormControl(0, { nonNullable: true, validators: [Validators.required, categorySelectedValidator()] })
  });

  questionsCount = signal<number>(0);

  showDialog = signal<boolean>(false);
  showOverlay = signal<boolean>(false);

  private surveyService = inject(SurveyService);
  validationService = inject(ValidationService);
  private router = inject(Router);
  private currentSurveyId:number = 0;
  

  async onSubmit(): Promise<void> {

    this.setAllFieldTouched();

    if (this.surveyForm.valid) {
      this.surveyForm.get('is_published')?.setValue(true);
      const surveyAddResult = await this.surveyService.handleAddSurvey(this.surveyForm);
      if(surveyAddResult > 0){
        this.currentSurveyId = surveyAddResult;
        this.afterCreateSurvey();
      }
    }
  }

  ngOnInit(): void {
    this.addQuestion();
  }

  private createNewQuestion(): FormGroup<QuestionForm> {
    const questionGroup: FormGroup<QuestionForm> = this.createQuestionGroup();
    const answers = questionGroup.controls.answers;

    answers.push(this.createAnswerGroup());
    answers.push(this.createAnswerGroup());
    return questionGroup;
  }

  private createQuestionGroup(): FormGroup<QuestionForm> {
    const questionFormGroup: FormGroup<QuestionForm> = new FormGroup<QuestionForm>({
      id: new FormControl(0, {nonNullable: true}),
      text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(120)] }),
      allow_multiple_answers: new FormControl(false, { nonNullable: true }),
      sort: new FormControl(0, {nonNullable: true}),
      answers: new FormArray<FormGroup<AnswerForm>>([])
    });
    return questionFormGroup;
  }

  private createAnswerGroup(): FormGroup<AnswerForm> {
    const answerFormGroup: FormGroup<AnswerForm> = new FormGroup<AnswerForm>({
      answerId: new FormControl(0, {nonNullable: true}),
      answerText: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
      select: new FormControl(false, {nonNullable: true}),
      sort: new FormControl(0, {nonNullable: true})
    });
    return answerFormGroup;
  }

  get questions(): FormArray<FormGroup<QuestionForm>> {
    return this.surveyForm.controls.questions;
  }

  getAnswers(questionIndex: number): FormArray<FormGroup<AnswerForm>> {
    const question = this.questions.at(questionIndex);
    if (!question) { return new FormArray<FormGroup<AnswerForm>>([]); }
    return question.controls.answers;
  }

  addAnswer(questionIndex: number): void {
    const answers = this.getAnswers(questionIndex);
    answers.push(this.createAnswerGroup());
  }

  removeAnswer({ questionIndex, answerIndex }: { questionIndex: number, answerIndex: number }): void {
    const answers = this.getAnswers(questionIndex);
    if (answers.length > 2) {
      answers.removeAt(answerIndex);
    }
  }

  addQuestion(): void {
    this.surveyForm.controls.questions.push(this.createNewQuestion());
    this.questionsCount.set(this.surveyForm.controls.questions.length);
  }

  removeQuestion(questionIndex: number): void {
    const questions = this.questions;
    if (questions.length > 1) {
      questions.removeAt(questionIndex);
      this.questionsCount.set(questions.length);
    }
  }

  onChooseCategory(category: Category): void {
    this.currentCategory.set(category);
    this.surveyForm.get('category_id')?.setValue(category.id);
  }

  onCancel(): void {
    this.router.navigate(['']);
  }

  private afterCreateSurvey(): void {
    this.showOverlay.set(true);
    setTimeout(() => {
      this.showDialog.set(true);
    }, this.DIALOG_DELAY);
  }


  onSuccessDialogClose(): void {
    this.showDialog.set(false);
    setTimeout(() => {
      this.showOverlay.set(false);
      this.callPublishedSurvey();
    }, this.OVERLAY_CLOSE_DELAY);
  }

  private setAllFieldTouched(): void {
    this.surveyForm.markAllAsTouched();
  }

  private callPublishedSurvey(): void {
    this.router.navigate(['/view', this.currentSurveyId]);
  }

}
