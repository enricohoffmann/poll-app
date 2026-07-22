import { Component, input, computed, signal, output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnswerForm } from '../../utils/types';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';

@Component({
  selector: 'app-answer-view',
  imports: [],
  templateUrl: './answer-view.html',
  styleUrl: './answer-view.scss',
})
export class AnswerView {

  answerIndex = input.required<number>();
  answerControl = input.required<FormGroup<AnswerForm>>();
  toggleAnswerEvent = output<number>();
  answerIdentifierService = inject(AnswerIdentifierService);

  get answer():FormControl<string> {
    return this.answerControl().controls.answerText;
  } 


  onAnswerClick(): void { 
    this.toggleAnswerEvent.emit(this.answerIndex()); 
  }
}
