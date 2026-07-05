import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function categorySelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (control.value > 0) { return null; }
        return {categoryNotSelected: true};
    };
}

export function expiresDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value as string;
        if(!value) {return null;}

        const datePattern = /^\d{2}.\d{2}.\d{4}$/;

        if(!datePattern.test(value)) {
            return {dateInvalid: true};
        }

        const date = new Date(value);

        if(Number.isNaN(date)) {
            return {dateInvalid: true};
        }

        const dateNow = Date.now();

        if(dateNow > date.getTime()) {
            return {dateExpired: true};
        }

        return null;
    }
}