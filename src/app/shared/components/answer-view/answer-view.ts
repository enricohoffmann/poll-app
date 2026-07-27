import { Component, input, output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AnswerForm } from '../../utils/types';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';

/**
 * @description Component for viewing an answer within a poll question.
 */
@Component({
  selector: 'app-answer-view',
  imports: [],
  templateUrl: './answer-view.html',
  styleUrls: ['./answer-view.scss'],
})
export class AnswerView {

  answerIndex = input.required<number>();
  answerControl = input.required<FormGroup<AnswerForm>>();
  toggleAnswerEvent = output<number>();
  answerIdentifierService = inject(AnswerIdentifierService);
  isReadOnly = input.required<boolean>();

  /**
   * @description Getter for the answer FormControl, which holds the text of the answer.
   * @returns {FormControl<string>} The FormControl for the answer text.
   */
  get answer():FormControl<string> {
    return this.answerControl().controls.text;
  } 

  /**
   * @description Handles the click event on the answer and emits the toggleAnswerEvent.
   * @returns {void}
   */ 
  onAnswerClick(): void { 
    if(this.isReadOnly()) { return;}
    this.toggleAnswerEvent.emit(this.answerIndex()); 
  }
}
