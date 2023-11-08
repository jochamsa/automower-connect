/// <reference types="node" />
import EventEmitter from 'events';
import Moment from 'moment';
import { AutoMowerConnection } from './AutoMowerConnection.js';
import { MowerMode, MowerState, MowerActivity, HusqvarnaMowerErrorCode as MowerErrorCode, RestrictedReason } from './Enums.js';
import { AutoMowerData, AutoMowerPosition } from './AutoMowerTypes.js';
export type AutoMowerApiData = {
    id: string;
    type: string;
    attributes: AutoMowerData;
};
export type AutoMowerWebSocketData = {
    id: string;
    type: string;
    attributes: any[];
};
export type AutoMowerWebSocketPositionData = {
    positions: AutoMowerPosition[];
};
export type AutoMowerWebSocketStatusData = {
    battery: {
        batteryPercent: number;
    };
    mower: {
        mode: string;
        activity: string;
        state: string;
        errorCode: number;
        errorCodeTimestamp: number;
    };
    planner: {
        nextStartTimestamp: number;
        override: {
            action: string;
        };
        restrictedReason: string;
    };
    metadata: {
        connected: boolean;
        statusTimestamp: number;
    };
};
export declare class AutoMower extends EventEmitter {
    protected connection: AutoMowerConnection;
    readonly id: string;
    data: AutoMowerData;
    lastErrorCode: MowerErrorCode;
    batteryPercent: number;
    mode: MowerMode;
    activity: MowerActivity;
    state: MowerState;
    errorCode: number;
    errorCodeTimestamp: Moment.Moment;
    nextStartTimestamp: Moment.Moment;
    overrideAction: string;
    restrictedReason: RestrictedReason;
    isConnected: boolean;
    statusTimestamp: Moment.Moment;
    constructor(connection: AutoMowerConnection, id: string, data: AutoMowerApiData);
    processAttributes(data: AutoMowerData): void;
    processWsAttributes(resultJson: AutoMowerWebSocketData): string[];
    private processStateEvent;
    private processPositionEvent;
    onStartRealtimeUpdates(func: () => void): this;
    onStopRealtimeUpdates(func: () => void): this;
    onUpdate(func: (updatedValues: string[]) => void): this;
    pauseMower(): Promise<void>;
    parkUntilNextSchedule(): Promise<void>;
    parkUntilFurtherNotice(): Promise<void>;
    parkForDurationOfTime(minutes: number): Promise<void>;
    resumeSchedule(): Promise<void>;
    startMowing(minutes?: number): Promise<void>;
    private command;
    get error(): MowerErrorCode;
}
