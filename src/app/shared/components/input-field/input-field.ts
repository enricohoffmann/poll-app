import { Component, input, signal, output } from '@angular/core';
import { InputFieldVariant } from '../../utils/types';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Button } from "../button/button";

/**
 * @description A reusable input field component.
 */
@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.scss'],
})
export class InputField {

  inputFieldVariant = input<InputFieldVariant>('labelTop');
  inputControl = input.required<FormControl<string | null>>();
  label = input<string>("");
  fieldId = input<string>("");
  placeHolder = input<string>("");
  hasTrash = input<boolean>(true);
  isWriting = signal<boolean>(false);
  isOptional = input<boolean>(false);
  readonly removeItem = output();

  /**
   * @description Sets the isWriting signal to true when the user starts typing in the input field.
   * @returns void
   * @memberof InputField
   */
  onInputEnter(): void{
    this.isWriting.set(true);
  }

  /**
   * @description Sets the isWriting signal to false when the user stops typing in the input field.
   * @returns void
   * @memberof InputField
   */
  onInputLeave(): void{
    this.isWriting.set(false);
  }

  /**
   * @description Clears the input field and emits the removeItem event.
   * @returns void
   * @memberof InputField
   */
  onDeleteContent(): void{
    this.inputControl().setValue('');
    this.inputControl().markAsUntouched();
    this.inputControl().markAsPristine();
    this.removeItem.emit();
  }

}
