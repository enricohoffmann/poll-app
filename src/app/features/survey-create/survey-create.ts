import { Component } from '@angular/core';
import { Status } from "../../shared/components/status/status";
import { Button } from "../../shared/components/button/button";
import { InputField } from '../../shared/components/input-field/input-field';
import { FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Survey } from '../../interfaces/survey-interface';


@Component({
  selector: 'app-survey-create',
  imports: [Status, Button, InputField, ReactiveFormsModule],
  templateUrl: './survey-create.html',
  styleUrl: './survey-create.scss',
})
export class SurveyCreate {

  survey:Survey = {
    id: 0,
    title: '',
    description: '',
    expires_at: '',
    category_id: 0,
    is_published: false,
    created_at: ''
  }; 

  surveyForm = new FormGroup({
    title: new FormControl(this.survey.title, {nonNullable: true, validators: [Validators.required, Validators.minLength(4)]}),
    description: new FormControl(this.survey.description, {nonNullable: true}),
    expires_at: new FormControl(this.survey.expires_at, {nonNullable: true})
  });

  onSubmit(): void {
    if(this.surveyForm.valid){
      console.log(this.surveyForm.value);
      
    }
  }

}
