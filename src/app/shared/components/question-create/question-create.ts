import { Component, input, signal, output, inject } from '@angular/core';
import { Button } from "../button/button";
import { InputField } from "../input-field/input-field";
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { AnswerCreate } from '../answer-create/answer-create';
import { CheckField } from '../check-field/check-field';
import { ValidationService } from '../../../services/validation-service';

@Component({
  selector: 'app-question-create',
  imports: [Button, InputField, AnswerCreate, CheckField],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss',
})
export class QuestionCreate {
  questionFormGroup = input.required<FormGroup>();
  questionIndex = input<number>(0);
  answerCount = signal<number>(0);
  readonly addAnswerEvent = output<number>();
  readonly removeAnswerEvent = output<{ questionIndex: number; answerIndex: number }>(); 
  readonly removeQuestionEvent = output<number>();
  validationService = inject(ValidationService);
  canRemoveQuestion = input<boolean>(true);

  ngOnInit():void {
    this.updateAnswerCount();
    
  }

  getQuestion(): FormControl<string> {
    return this.questionFormGroup().controls['text'] as FormControl<string>;
  }

  getAllowMultiAnswers(): FormControl<boolean> {
    return this.questionFormGroup().controls['allow_multiple_answers'] as FormControl<boolean>;
  }

  get answers(): FormArray<FormGroup> {
    return this.questionFormGroup().controls['answers'] as FormArray;
  }

  onAddAnswer(questionIndex: number){
    this.addAnswerEvent.emit(questionIndex);
    this.updateAnswerCount();
  }

  private updateAnswerCount(): void {
    const answerFormArray = this.questionFormGroup().controls['answers'] as FormArray;
    this.answerCount.set(answerFormArray.length);
  }

  onRemoveAnswer(answerIndex: number): void{
    this.removeAnswerEvent.emit({questionIndex: this.questionIndex(), answerIndex: answerIndex});
    this.updateAnswerCount();
  }

  onRemoveQuestion(): void {
    this.removeQuestionEvent.emit(this.questionIndex());
  }

}
