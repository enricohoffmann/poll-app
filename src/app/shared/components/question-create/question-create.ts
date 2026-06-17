import { Component, input, signal, output } from '@angular/core';
import { Button } from "../button/button";
import { InputField } from "../input-field/input-field";
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { AnswerCreate } from '../answer-create/answer-create';

@Component({
  selector: 'app-question-create',
  imports: [Button, InputField, AnswerCreate],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss',
})
export class QuestionCreate {
  questionFormGroup = input.required<FormGroup>();
  questionIndex = input<number>(0);
  answerCount = signal<number>(0);
  readonly addAnswerEvent = output<number>();
  readonly removeAnswerEvent = output<{ questionIndex: number; answerIndex: number }>(); 

  ngOnInit():void {
    this.updateAnswerCount();
    
  }

  getQuestion(): FormControl<string> {
    return this.questionFormGroup().controls['text'] as FormControl<string>;
  }

  get answers(): FormArray<FormGroup> {
    return this.questionFormGroup().controls['answers'] as FormArray;
  }

  onAddAnswer(){
    this.addAnswerEvent.emit(this.questionIndex());
    this.updateAnswerCount();
  }

  private updateAnswerCount(): void {
    const answerFormArray = this.questionFormGroup().controls['answers'] as FormArray;
    this.answerCount.set(answerFormArray.length);
  }

  onRemoveAnswer(answerIndex: number): void{
    this.removeAnswerEvent.emit({questionIndex: this.questionIndex(), answerIndex: answerIndex});
  }

}
