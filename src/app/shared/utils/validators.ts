import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { checkGermanDate } from "./custom-functions";


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
    }
}

export function expiresDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if(!value) {return null;}

        if(!checkGermanDate(value)) { return {dateInvalid: true}; }

        return null;
    }
}

export function expiresDateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
       
        if(!value) {return null;}

        const date = new Date(value);
        const dateNow = Date.now();

        if(!checkGermanDate(value)) { return {dateInvalid: true}; }
        if(dateNow > date.getTime()) { return {dateExpired: true}; }

        return null;
    }
}