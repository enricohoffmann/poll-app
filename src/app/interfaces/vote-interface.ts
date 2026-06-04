export interface Vote {
    id: number;
    question_id: number;
    answer_id: number;
    voter_token: string;
    created_at: string;
}