import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { VALIDATION_MESSAGES } from '../shared/utils/validation-messages';

/**
 * @description Service for handling form validation and error messages.
 */
@Injectable({
  providedIn: 'root',
})
export class ValidationService {

  /**
   * @description Returns the error message for the given form control.
   * @param control The form control to get the error message for.
   * @returns {string | null} The error message, or null if there is no error.
   */
  getErrorMessage(control: AbstractControl | null): string | null {
    if(control == null) {return null;}
    if (!control.errors) { return null; }
    if (control.untouched && control.invalid) { return null; }

    const firstErrorKey = Object.keys(control.errors)[0];
    const errorMessageFactory = VALIDATION_MESSAGES[firstErrorKey as keyof typeof VALIDATION_MESSAGES];
    if (!errorMessageFactory) { return 'Unknown validation error.'; }

    return errorMessageFactory(control.errors[firstErrorKey]);
  }


}
