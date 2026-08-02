import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { checkDateInGermanFormat, getDateFromGermanDate } from "./custom-functions";
import { QuestionForm } from "./types";


/**
 * @description Validator to check if a category is selected.
 * @returns {ValidatorFn} A validator function that returns a validation error if no category is selected.
 */
export function categorySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value > 0) { return null; }
        return { categoryNotSelected: true };
    };
}

/**
 * @description Validator to check if the input value matches the German date format (dd.mm.yyyy).
 * @returns {ValidatorFn} A validator function that returns a validation error if the date format is invalid.
 */
export function expiresDatePatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if (!value) { return null; }

        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

        if (!datePattern.test(value)) { return { datePatternInvalid: true }; }
        return null;
    };
}

/**
 * @description Validator to check if the input value is a valid date in German format (dd.mm.yyyy).
 * @returns {ValidatorFn} A validator function that returns a validation error if the date is invalid.
 */
export function expiresDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if (!value) { return null; }

        if (!checkDateInGermanFormat(value)) { return { dateInvalid: true }; }

        return null;
    };
}

/**
 * @description Validator to check if the input date is not in the past.
 * @returns {ValidatorFn} A validator function that returns a validation error if the date is in the past.
 */
export function expiresDateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if (!value) { return null; }

        const date = getDateFromGermanDate(value);
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);

        if (dateNow.getTime() > date.getTime()) { return { dateExpired: true }; }

        return null;
    };
}

/**
 * @description Validator to check if at least one answer is selected for a question.
 * @returns {ValidatorFn} A validator function that returns a validation error if no answer is selected.
 */
export function questionAnsweredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const question = control as FormGroup<QuestionForm>;
        const hasSelectedAnswer = question.controls.answers.controls.some(
            answer => answer.controls.select.value
        );

        return hasSelectedAnswer ? null : { noAnswerSelected: true };
    };
}

/**
 * @description Validator to check if the input value contains only whitespace.
 * This validator is used to ensure that form controls do not accept values that consist solely of whitespace characters.
 * It trims the input value and checks if the resulting length is zero, indicating that the input was only whitespace.
 * If the input is only whitespace, it returns a validation error; otherwise, it returns null, indicating that the input is valid.
 * @returns {ValidatorFn} A validator function that returns a validation error if the input contains only whitespace.
 */
export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (typeof value !== 'string') {
            return null;
        }

        if (value.length === 0) {
            return null;
        }

        return value.trim().length === 0 ? { whitespace: true } : null;
    };
}

