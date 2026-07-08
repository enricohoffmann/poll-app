import { Component, input, signal, output } from '@angular/core';
import { InputFieldVariant } from '../../utils/types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from "../button/button";

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {

  inputFieldVariant = input<InputFieldVariant>('labelTop');
  inputControl = input.required<FormControl<string>>();
  label = input<string>("");
  fieldId = input<string>("");
  placeHolder = input<string>("");
  hasTrash = input<boolean>(true);
  isWriting = signal<boolean>(false);
  isOptional = input<boolean>(false);
  readonly removeItem = output();

  onInputEnter(): void{
    this.isWriting.set(true);
  }

  onInputLeave(): void{
    this.isWriting.set(false);
  }

  onDeleteContent(): void{
    this.inputControl().setValue('');
    this.removeItem.emit();
  }

}
