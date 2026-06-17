import { Component, input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputField } from "../input-field/input-field";

@Component({
  selector: 'app-answer-create',
  imports: [InputField],
  templateUrl: './answer-create.html',
  styleUrl: './answer-create.scss',
})
export class AnswerCreate {
  answerFormGroup = input.required<FormGroup>();

  getAnswer():FormControl<string> {
    return this.answerFormGroup().controls['text'] as FormControl<string>;
  } 
}
