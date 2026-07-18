import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { checkDateInGermanFormat, getDateFromGermanDate } from "./custom-functions";
import { QuestionForm } from "./types";



export function categorySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value > 0) { return null; }
        return {categoryNotSelected: true};
    };
}

export function expiresDatePatternValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if(!value) {return null;}

        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

        if(!datePattern.test(value)) { return {datePatternInvalid: true}; }
        return null;
    };
}

export function expiresDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if(!value) {return null;}
        
        if(!checkDateInGermanFormat(value)) { return {dateInvalid: true}; }

        return null;
    };
}

export function expiresDateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if(!value) {return null;}

        const date = getDateFromGermanDate(value);
        const dateNow = new Date();
        dateNow.setHours(0, 0, 0, 0);

        if(dateNow.getTime() > date.getTime()) { return {dateExpired: true}; }

        return null;
    }
}

export function questionAnsweredValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const question = control as FormGroup<QuestionForm>;
        const hasSelectedAnswer = question.controls.answers.controls.some(
            answer => answer.controls.select.value
        );

        return hasSelectedAnswer ? null : { noAnswerSelected: true};
    };
}