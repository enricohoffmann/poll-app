import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { VALIDATION_MESSAGES } from '../shared/utils/validation-messages';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  getErrorMessage(control: AbstractControl): string | null {
    if (!control.errors) { return null; }
    if (!(control.touched || control.dirty)) { return null; }

    const firstErrorKey = Object.keys(control.errors)[0];
    const errorMessageFactory = VALIDATION_MESSAGES[firstErrorKey as keyof typeof VALIDATION_MESSAGES];
    if (!errorMessageFactory) { return 'Unknown validation error.'; }

    return errorMessageFactory(control.errors[firstErrorKey]);
  }


}
