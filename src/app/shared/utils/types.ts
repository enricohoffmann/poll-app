import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type HeaderVariant = 'whiteHeader' | 'prupleHeader';

export type ButtonVariant = 'primaryBtn' | 'secondaryBtn' | 'tertiaryBtn' | 'filterBtn' | 'trashBtn' | 'homeMobile';

export type SurveyCardVariant = 'highlights' | 'listview';

export type InputFieldVariant = 'labelTop' | 'labelLeft' | 'textArea' | 'noLabel';

export type ButtonIconVariant = 'add' | 'check' | 'addWhite' | 'closeWhite' | 'closePurple';

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

export type SurveyForm = {
    id: FormControl<number>;
    title: FormControl<string>;
    description: FormControl<string | null>;
    expires_at: FormControl<string | null>;
    questions: FormArray<FormGroup<QuestionForm>>;
    is_published: FormControl<boolean>;
    category_id: FormControl<number>;
};