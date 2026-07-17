import { Component, input, computed, signal, output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnswerForm } from '../../utils/types';

@Component({
  selector: 'app-answer-view',
  imports: [],
  templateUrl: './answer-view.html',
  styleUrl: './answer-view.scss',
})
export class AnswerView {

  private readonly ANSWER_IDENTIFIER: Record<number, string> = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F'
  };

  answerIndex = input.required<number>();
  answerControl = input.required<FormGroup<AnswerForm>>();
  toggleAnswerEvent = output<number>();

  get answer():FormControl<string> {
    return this.answerControl().controls.answerText;
  } 

  get identifier(): string {
    return this.ANSWER_IDENTIFIER[this.answerIndex()];
  }

  onAnswerClick(): void { 
    this.toggleAnswerEvent.emit(this.answerIndex()); 
  }
}
