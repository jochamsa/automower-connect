/// <reference types="node" />
import { AutoMower, AutoMowerApiData } from './AutoMower.js';
export type AutoConnectConnectionConfig = {
    apiKey: string;
    clientSecret: string;
};
export type AutoMowerApiDataResult = {
    data: AutoMowerApiData[];
};
export declare class AutoConnectApiError extends Error {
}
export declare enum ApiOutput {
    Json = "json",
    Text = "txt"
}
export declare class AutoMowerConnection {
    private auth;
    private mowers;
    private ws;
    private keepWsAlive;
    constructor(config: AutoConnectConnectionConfig);
    getMower(id: string): Promise<AutoMower>;
    getMowers(): Promise<AutoMower[]>;
    updateMowersList(): Promise<void>;
    apiRequest(url: string | URL, headers?: any, method?: string, body?: any, expectedStatus?: number, expectedOutput?: ApiOutput): Promise<any>;
    activateRealtimeUpdates(): Promise<void>;
    deactivateRealtimeUpdates(): Promise<void>;
}
