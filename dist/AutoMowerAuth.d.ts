import { AutoMowerAccessToken } from './AutoMowerAccessToken.js';
export type AutoMowerAuthConfig = {
    apiKey: string;
    clientSecret: string;
};
export declare class AutoConnectWrongCredentialsError extends Error {
}
export declare class AutoConnectAuthError extends Error {
}
export declare class AutoConnectAuth {
    readonly apiKey: string;
    private clientSecret;
    private accessToken;
    constructor(config: AutoMowerAuthConfig);
    getValidAccessToken(): Promise<AutoMowerAccessToken>;
}
