import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type HeaderVariant = 'whiteHeader' | 'prupleHeader';

export type ButtonVariant = 'primaryBtn' | 'secondaryBtn' | 'tertiaryBtn' | 'filterBtn' | 'trashBtn';

export type SurveyCardVariant = 'highlights' | 'listview';

export type InputFieldVariant = 'labelTop' | 'labelLeft' | 'textArea' | 'noLabel';

export type ButtonIconVariant = 'add' | 'check' | 'addWhite' | 'closeWhite';

export type QuestionForm = {
    id: FormControl<number>;
    text: FormControl<string>;
    allow_multiple_answers: FormControl<boolean>;
    sort: FormControl<number>
    answers: FormArray<FormGroup<AnswerForm>>;
}

export type AnswerForm = {
    answerId: FormControl<number>;
    answerText: FormControl<string>;
    select: FormControl<boolean>;
    sort: FormControl<number>;
};

export type VoteFrom = {
    questions: FormArray<FormGroup<QuestionForm>>;
}