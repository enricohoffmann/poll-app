import { Component, input, output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputField } from "../input-field/input-field";
import { Button } from '../button/button';
import { ValidationService } from '../../../services/validation-service';
import { AnswerForm } from '../../utils/types';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';

/**
 * @description Component for creating an answer within a poll question.
 */
@Component({
  selector: 'app-answer-create',
  imports: [InputField, Button],
  templateUrl: './answer-create.html',
  styleUrls: ['./answer-create.scss'],
})
export class AnswerCreate {
  answerFormGroup = input.required<FormGroup<AnswerForm>>();
  answerIndex = input<number>(0);
  questionIndex = input<number>(0);
  canInsertAnswer = input<boolean>(true);
  canRemoveAnswer = input<boolean>(true);
  readonly removeAnswer = output<number>();
  readonly addAnswer = output<number>();
  validationService = inject(ValidationService);
  answerIdentifierService = inject(AnswerIdentifierService);

  /**
   * @description Gets the FormControl for the answer text from the answer form group.
   * @returns {FormControl<string>} The FormControl for the answer text.
   */
  getAnswer():FormControl<string> {
    return this.answerFormGroup().controls.text;
  } 

  /**
   * @description Gets the unique identifier for the answer based on its index.
   * @returns {string} The unique identifier for the answer.
   */
  getIdentifier(): string {
    return this.answerIdentifierService.getIdentifier(this.answerIndex());
  }

  /**
   * @description Emits an event to remove the answer at the specified index.
   * @returns {void}
   */
  onRemoveAnswer(): void {
    this.removeAnswer.emit(this.answerIndex());
  }

  /**
   * @description Emits an event to add a new answer to the current question.
   * @returns {void}
   */
  onAddAnswer(): void {
    this.addAnswer.emit(this.questionIndex());
  }

}
