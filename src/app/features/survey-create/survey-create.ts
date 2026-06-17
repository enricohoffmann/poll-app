import { Component } from '@angular/core';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { InputField } from '../../shared/components/input-field/input-field';
import { FormGroup, ReactiveFormsModule, Validators, FormControl, FormArray } from '@angular/forms';
import { Survey } from '../../interfaces/survey-interface';
import { Question } from '../../interfaces/question-interface';
import { Answer } from '../../interfaces/answer-interface';
import { QuestionCreate } from '../../shared/components/question-create/question-create';


@Component({
  selector: 'app-survey-create',
  imports: [Status, Button, InputField, ReactiveFormsModule, QuestionCreate],
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

  surveyForm = new FormGroup({
    title: new FormControl(this.survey.title, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
    description: new FormControl(this.survey.description, { nonNullable: true }),
    expires_at: new FormControl(this.survey.expires_at, { nonNullable: true }),
    questions: new FormArray<FormGroup>([])
  });

  onSubmit(): void {
    if (this.surveyForm.valid) {
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
      text: new FormControl(question.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] }),
      allow_multiple_answers: new FormControl(question.allow_multiple_answers, { nonNullable: true }),
      answers: new FormArray<FormGroup>([])
    });
    return questionFormGroup;
  }

  private createAnswerGroup(): FormGroup {
    const answer: Answer = { id: 0, question_id: 0, text: '', sort_order: 1 };
    const answerFormGroup: FormGroup = new FormGroup({
      text: new FormControl(answer.text, { nonNullable: true, validators: [Validators.required, Validators.minLength(4)] })
    });
    return answerFormGroup;
  }

  get questions(): FormArray<FormGroup> {
    return this.surveyForm.controls.questions as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    const question = this.questions.at(questionIndex);
    if(!question) {return new FormArray<FormGroup>([]);}
    return question.controls['answers'] as FormArray;
  }

  addAnswer(questionIndex: number): void{
    const answers = this.getAnswers(questionIndex);
    answers.push(this.createAnswerGroup());
  }

  removeAnswer({questionIndex, answerIndex}: {questionIndex: number, answerIndex: number}): void {
    const answers = this.getAnswers(questionIndex);
    if(answers.length > 2){
      answers.removeAt(answerIndex);
    }
  }

  addQuestion(): void {
    this.surveyForm.controls.questions.push(this.createNewQuestion());
  }

  removeQuestion(questionIndex: number): void {
    const questions = this.questions;
    if(questions.length > 1) {
      questions.removeAt(questionIndex);
    }
  }
}
