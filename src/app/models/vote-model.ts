import { Vote } from "../interfaces/vote-interface";

/**
 * VoteModel class represents a vote in the polling application. It implements the Vote interface and provides methods to create a new vote and retrieve a clean JSON representation of the vote data.
 */
export class VoteModel implements Vote {
    id: number;
    question_id: number;
    answer_id: number;
    voter_token: string;

    /**
     * @description Creates a new instance of the VoteModel class.
     * @param answerId - The ID of the answer being voted for.
     * @param questionId - The ID of the question being voted on.
     * @param voterToken - The token identifying the voter.
     */
    constructor(answerId: number, questionId: number, voterToken: string) {
        this.id = 0;
        this.question_id = questionId;
        this.answer_id = answerId;
        this.voter_token = voterToken;
    }

    /**
     * @description Returns a clean JSON representation of the vote data, excluding the ID. This is useful for sending the vote data to an API or storing it in a database without including the ID field.
     * @returns {object} The clean JSON representation of the vote data.
     */
    getCleanAddVoteJson(): {} {
        return {
            question_id: this.question_id,
            answer_id: this.answer_id,
            voter_token: this.voter_token
        };
    }
}