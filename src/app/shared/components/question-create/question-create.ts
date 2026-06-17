import { Component, input } from '@angular/core';
import { Button } from "../button/button";
import { InputField } from "../input-field/input-field";
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-question-create',
  imports: [Button, InputField],
  templateUrl: './question-create.html',
  styleUrl: './question-create.scss',
})
export class QuestionCreate {
  questionFormGroup = input.required<FormGroup>();

  getQuestion(): FormControl<string> {
    return this.questionFormGroup().controls['text'] as FormControl<string>;
  }

  get answers(): FormArray<FormGroup> {
    return this.questionFormGroup().controls['answers'] as FormArray;
  }
}
