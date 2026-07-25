import { Answer } from "./answer-interface";
import { Question } from "./question-interface";

/**
 * @description Represents a survey question along with its possible answers.
 */
export interface QuestionWithAnswers extends Question {
    answers: Answer[];
}