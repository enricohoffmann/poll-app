import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})
export class VoterTokenService {
    private readonly STORAGE_KEY = 'pollapp-voter-token';

    getToken(): string {
        let token = localStorage.getItem(this.STORAGE_KEY);
        return !token ? this.setToken() : token;
    }

    getTokenForReview():string {
        return crypto.randomUUID();
    }

    private setToken(): string {
        const token = crypto.randomUUID();
        localStorage.setItem(this.STORAGE_KEY, token);
        return token;
    }
}