/**
 * @description Represents an answer to a survey question.
 */
export interface Answer {
    id: number;
    question_id: number;
    text: string;
    sort_order: number;
}