import Moment from 'moment';
export type AutoConnectRawAccessTokenJson = {
    access_token: string;
    user_id: string;
    scope: string;
    expires_in: number;
};
export declare class AutoMowerAccessToken {
    readonly expiresAt: Moment.Moment;
    readonly accessToken: string;
    readonly userId: string;
    readonly scope: string;
    private constructor();
    isExpired(): boolean;
    static retrieveNew(apiKey: string, clientSecret: string): Promise<AutoMowerAccessToken>;
    toString(): string;
}
