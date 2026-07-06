import { Component, inject, signal } from '@angular/core';
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
import { SurveyModel } from '../../models/survey-model';
import { categorySelectedValidator, expiresDateNotPastValidator, expiresDatePatternValidator, expiresDateValidator } from '../../shared/utils/validators';
import { VALIDATION_MESSAGES } from '../../shared/utils/validation-messages';


@Component({
  selector: 'app-survey-create',
  imports: [
    Status, Button, InputField, ReactiveFormsModule, QuestionCreate, DropDownMenu, DateField, Dialog
  ],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {

  private readonly DIALOG_DELAY = 125;
  private readonly OVERLAY_CLOSE_DELAY = 1600;

  survey: Survey = {
    id: 0,
    title: '',
    description: '',
    expires_at: '',
    category_id: 0,
    is_published: false,
    created_at: ''
  };

  currentCategory = signal<Category | null>(null);

  surveyForm = new FormGroup({
    title: new FormControl(this.survey.title, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] }),
    description: new FormControl(this.survey.description, { nonNullable: true, validators: [Validators.maxLength(300)] }),
    expires_at: new FormControl(this.survey.expires_at, { nonNullable: true, validators: [expiresDatePatternValidator(), expiresDateValidator(), expiresDateNotPastValidator()] }),
    questions: new FormArray<FormGroup>([]),
    is_published: new FormControl(this.survey.is_published),
    category_id: new FormControl(this.survey.category_id, { nonNullable: true, validators: [Validators.required, categorySelectedValidator()] })
  });

  questionsCount = signal<number>(0);

  showDialog = signal<boolean>(false);
  showOverlay = signal<boolean>(false);

  private surveyService = inject(SurveyService);
  private router = inject(Router);

  

  async onSubmit(): Promise<void> {
    if (this.surveyForm.valid) {
      /* const surveyAddResult = await this.surveyService.handleAddSurvey(this.surveyForm);
      console.log(surveyAddResult); */

      this.surveyForm.get('is_published')?.setValue(true);

      console.log(this.surveyForm.value);

      this.afterCreateSurvey();

    }
  }

  ngOnInit(): void {
    this.addQuestion();
  }

  private createNewQuestion(): FormGroup {
    const questionGroup: FormGroup = this.createQuestionGroup();
    const answers = questionGroup.controls['answers'] as FormArray;

    answers.push(this.createAnswerGroup());
    answers.push(this.createAnswerGroup());
    return questionGroup;
  }

  private createQuestionGroup(): FormGroup {
    const question: Question = { id: 0, survey_id: this.survey.id, text: '', allow_multiple_answers: false, sort_order: 1 };
    const questionFormGroup: FormGroup = new FormGroup({
      text: new FormControl(question.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(120)] }),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, { nonNullable: true }),
      answers: new FormArray<FormGroup>([])
    });
    return questionFormGroup;
  }

  private createAnswerGroup(): FormGroup {
    const answer: Answer = { id: 0, question_id: 0, text: '', sort_order: 1 };
    const answerFormGroup: FormGroup = new FormGroup({
      text: new FormControl(answer.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)] })
    });
    return answerFormGroup;
  }

  get questions(): FormArray<FormGroup> {
    return this.surveyForm.controls.questions as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    const question = this.questions.at(questionIndex);
    if (!question) { return new FormArray<FormGroup>([]); }
    return question.controls['answers'] as FormArray;
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
    }, this.OVERLAY_CLOSE_DELAY);
  }

  getErrorMessage(control: AbstractControl): string | null {
    if(!control.errors) {return null;}
    console.log(control.errors);
    
    const firstErrorKey = Object.keys(control.errors)[0];
    const errorMessageFactory = VALIDATION_MESSAGES[firstErrorKey as keyof typeof VALIDATION_MESSAGES];
    if(!errorMessageFactory) {return 'Unknown validation error.';}
    
    return errorMessageFactory(control.errors[firstErrorKey]);
  }


}
