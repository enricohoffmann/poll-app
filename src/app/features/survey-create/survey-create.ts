import { Component, inject, signal, computed } from '@angular/core';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { InputField } from '../../shared/components/input-field/input-field';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray } from '@angular/forms';
import { Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/question-interface';
import { Answer } from '../../interfaces/answer-interface';
import { QuestionCreate } from '../../shared/components/question-create/question-create';
import { SurveyService } from '../../services/survey-service';
import { DropDownMenu } from "../../shared/components/drop-down-menu/drop-down-menu";
import { Category } from '../../interfaces/category-interface';
import { DateField } from '../../shared/components/date-field/date-field';
import { Router } from '@angular/router';


@Component({
  selector: 'app-survey-create',
  imports: [
    Status, Button, InputField, ReactiveFormsModule, QuestionCreate, DropDownMenu, DateField
  ],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {

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
    title: new FormControl(this.survey.title, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)]}),
    description: new FormControl(this.survey.description, { nonNullable: true, validators: [Validators.maxLength(300)]}),
    expires_at: new FormControl(this.survey.expires_at, { nonNullable: true }),
    questions: new FormArray<FormGroup>([])
  });

  questionsCount = signal<number>(0);

  private surveyService = inject(SurveyService);
  private router = inject(Router);

  async onSubmit(): Promise<void> {
    if (this.surveyForm.valid) {
      /* const surveyAddResult = await this.surveyService.handleAddSurvey(this.surveyForm);
      console.log(surveyAddResult); */

      console.log(this.surveyForm.value);
      
      
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
      text: new FormControl(question.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(120)]}),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, { nonNullable: true }),
      answers: new FormArray<FormGroup>([])
    });
    return questionFormGroup;
  }

  private createAnswerGroup(): FormGroup {
    const answer: Answer = { id: 0, question_id: 0, text: '', sort_order: 1 };
    const answerFormGroup: FormGroup = new FormGroup({
      text: new FormControl(answer.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4), Validators.maxLength(80)]})
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
  }

  onCancel():void {
    this.router.navigate(['']);
  }

}
