import { Injectable } from "@angular/core";

/**
 * @description Service to manage the voter token in local storage. The token is used to identify a voter and ensure that they can only vote once in a poll. 
 * If a token does not exist, a new one is generated and stored in local storage.
 * For review purposes, a new token can be generated without storing it in local storage.
 */
@Injectable({
    providedIn: 'root',
})
export class VoterTokenService {
    private readonly STORAGE_KEY = 'pollapp-voter-token';

    /**
     * @description Retrieves the voter token from local storage. If no token exists, a new one is generated and stored.
     * @returns {string} The voter token.
     */
    getToken(): string {
        let token = localStorage.getItem(this.STORAGE_KEY);
        return !token ? this.setToken() : token;
    }

    /**
     * @description Generates a new voter token for review purposes without storing it in local storage.
     * @returns {string} The newly generated voter token.
     */
    getTokenForReview(): string {
        return crypto.randomUUID();
    }

    /**
     * @description Sets a new voter token in local storage and returns it.
     * @returns {string} The newly generated voter token.
     */
    private setToken(): string {
        const token = crypto.randomUUID();
        localStorage.setItem(this.STORAGE_KEY, token);
        return token;
    }


}