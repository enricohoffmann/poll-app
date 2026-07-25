/**
 * @description Represents a survey question.
 */
export interface Question {
    id: number;
    survey_id: number;
    text: string;
    allow_multiple_answers: boolean;
    sort_order: number;
}