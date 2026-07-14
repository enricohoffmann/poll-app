import { Component, input, output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputField } from "../input-field/input-field";
import { Button } from '../button/button';
import { ValidationService } from '../../../services/validation-service';
import { AnswerForm } from '../../utils/types';

@Component({
  selector: 'app-answer-create',
  imports: [InputField, Button],
  templateUrl: './answer-create.html',
  styleUrl: './answer-create.scss',
})
export class AnswerCreate {

  private readonly ANSWER_IDENTIFIER: Record<number, string> = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F'
  };

  answerFormGroup = input.required<FormGroup<AnswerForm>>();
  answerIndex = input<number>(0);
  questionIndex = input<number>(0);
  canInsertAnswer = input<boolean>(true);
  canRemoveAnswer = input<boolean>(true);
  readonly removeAnswer = output<number>();
  readonly addAnswer = output<number>();
  validationService = inject(ValidationService);

  getAnswer():FormControl<string> {
    return this.answerFormGroup().controls.answerText;
  } 

  getIdentifier(): string {
    return this.ANSWER_IDENTIFIER[this.answerIndex()];
  }

  onRemoveAnswer(): void {
    this.removeAnswer.emit(this.answerIndex());
  }

  onAddAnswer(): void {
    this.addAnswer.emit(this.questionIndex());
  }

}
