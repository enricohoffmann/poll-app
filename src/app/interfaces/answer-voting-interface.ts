import { Answer } from "./answer-interface";

export interface AnswerVoting extends Answer {
    selected: boolean | null | undefined;
}