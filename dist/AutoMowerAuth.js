import { AutoMowerAccessToken } from './AutoMowerAccessToken.js';
export class AutoConnectWrongCredentialsError extends Error {
}
export class AutoConnectAuthError extends Error {
}
export class AutoConnectAuth {
    apiKey;
    clientSecret;
    accessToken;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.clientSecret = config.clientSecret;
    }
    async getValidAccessToken() {
        if (!this.accessToken || this.accessToken.isExpired()) {
            // Retieve new accessToken
            this.accessToken = await AutoMowerAccessToken.retrieveNew(this.apiKey, this.clientSecret);
        }
        return this.accessToken;
    }
}
//# sourceMappingURL=AutoMowerAuth.js.map