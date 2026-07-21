import { Vote } from "../interfaces/vote-interface";


export class VoteModel implements Vote {
    id: number;
    question_id: number;
    answer_id: number;
    voter_token: string;

    constructor(answerId: number, questinId: number, voterToken: string) {
        this.id = 0;
        this.question_id = questinId;
        this.answer_id = answerId;
        this.voter_token = voterToken;
    }

    getCleanAddVoteJson(): {} {
        return {
            question_id: this.question_id,
            answer_id: this.answer_id,
            voter_token: this.voter_token
        };
    }
}