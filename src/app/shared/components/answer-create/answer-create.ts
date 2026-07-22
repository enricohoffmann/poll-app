import { Component, input, output, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputField } from "../input-field/input-field";
import { Button } from '../button/button';
import { ValidationService } from '../../../services/validation-service';
import { AnswerForm } from '../../utils/types';
import { AnswerIdentifierService } from '../../../services/answer-identifier-service';

@Component({
  selector: 'app-answer-create',
  imports: [InputField, Button],
  templateUrl: './answer-create.html',
  styleUrl: './answer-create.scss',
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

  getAnswer():FormControl<string> {
    return this.answerFormGroup().controls.answerText;
  } 

  getIdentifier(): string {
    return this.answerIdentifierService.getIdentifier(this.answerIndex());
  }

  onRemoveAnswer(): void {
    this.removeAnswer.emit(this.answerIndex());
  }

  onAddAnswer(): void {
    this.addAnswer.emit(this.questionIndex());
  }

}
