import { Answer } from "./answer-interface";
import { Question } from "./question-interface";


export interface QuestionWithAnswers extends Question {
    answers: Answer[];
}