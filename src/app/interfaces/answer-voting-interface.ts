import { Answer } from "./answer-interface";

/**
 * @description Represents an answer to a survey question with voting information.
 */
export interface AnswerVoting extends Answer {
    selected: boolean | null | undefined;
}