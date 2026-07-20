import { inject } from "@angular/core";
import { Answer } from "../interfaces/answer-interface";
import { Vote } from "../interfaces/vote-interface";
import { VoterTokenService } from "../services/voter-token-service";


export class VoteModel implements Vote {
    id: number;
    question_id: number;
    answer_id: number;
    voter_token: string;

    voterTokenService = inject(VoterTokenService);

    constructor(answerData: Partial<Answer> = {}, questinId: number) {
        this.id = 0;
        this.question_id = questinId;
        this.answer_id = answerData.id ?? 0;
        this.voter_token = this.voterTokenService.getToken();
        
    }

}