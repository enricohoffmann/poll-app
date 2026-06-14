import { Component, input } from '@angular/core';
import { InputFieldVariant } from '../../utils/types';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {

  inputFieldVariant = input<InputFieldVariant>('labelTop');
  inputControl = input.required<FormControl<string>>();
  label = input<string>("");
  fieldId = input<string>("");
  title = input<string>("");
  placeHolder = input<string>("");
  hasTrash = input<boolean>(true);

  ngOnInit(){
    
  }

}
