import EventEmitter from 'events';
import Moment from 'moment';
import { API_BASE } from './config.js';
import { ApiOutput, AutoConnectApiError, AutoMowerConnection } from './AutoMowerConnection.js';
import { MowerMode, MowerState, MowerActivity, HusqvarnaMowerErrorCode as MowerErrorCode, AutoMowerCommand, RestrictedReason, OverrideAction } from './Enums.js';
import { AutoMowerData, AutoMowerPosition } from './AutoMowerTypes.js';

export type AutoMowerApiData = {
    id: string,
    type: string,
    attributes: AutoMowerData
};

export type AutoMowerWebSocketData = {
    id: string,
    type: string,
    attributes: any[]
};

export type AutoMowerWebSocketPositionData = {
    positions: AutoMowerPosition[]
};

export type AutoMowerWebSocketStatusData = {
    battery: {
        batteryPercent: number
    },
    mower: {
        mode: string,
        activity: string,
        state: string,
        errorCode: number,
        errorCodeTimestamp: number
    },
    planner: {
        nextStartTimestamp: number,
        override: {
            action: string
        },
        restrictedReason: string,
    },
    metadata: {
        connected: boolean,
        statusTimestamp: number
    }
};

export class AutoMower extends EventEmitter {
    protected connection: AutoMowerConnection;
    public readonly id: string;
    public data: AutoMowerData;
    public lastErrorCode: MowerErrorCode;
    public batteryPercent: number;
    public mode: MowerMode;
    public activity: MowerActivity;
    public state: MowerState;
    public errorCode: number;
    public errorCodeTimestamp: Moment.Moment;
    public nextStartTimestamp: Moment.Moment;
    public overrideAction: string;
    public restrictedReason: RestrictedReason;
    public isConnected: boolean;
    public statusTimestamp: Moment.Moment;

    public constructor(connection: AutoMowerConnection, id: string, data: AutoMowerApiData) {
        super();

        this.connection = connection;
        this.id = id;

        this.processAttributes(data.attributes);
        this.processStateEvent(data.attributes as unknown as AutoMowerWebSocketStatusData);
    }

    public processAttributes(data: AutoMowerData) {
        this.data = data;
    }

    public processWsAttributes(resultJson: AutoMowerWebSocketData): string[] {
        const updatedFields: string[] = [];

        if (resultJson.id == this.id) {
            switch (resultJson.type) {
                case "positions-event":
                    {
                        this.processPositionEvent((resultJson.attributes as unknown) as AutoMowerWebSocketPositionData);
                        return ["positions"];
                    }

                case "status-event":
                    {
                        this.processStateEvent((resultJson.attributes as unknown) as AutoMowerWebSocketStatusData);
                        break;
                    }

                case "settings-event":
                    {

                        break;
                    }

                default:
                    {

                        break;
                    }
            }
        }

        return updatedFields;
    }

    private processStateEvent(stateJson: AutoMowerWebSocketStatusData): string[] {
        const updatedFields: string[] = [];

        let newBatteryPercent = +stateJson.battery.batteryPercent;
        if (this.batteryPercent != newBatteryPercent) {
            this.data.battery.batteryPercent = newBatteryPercent;
            this.batteryPercent = newBatteryPercent;
            updatedFields.push("batteryPercent");
        }

        let newMode = MowerMode[stateJson.mower.mode];
        if (this.mode != newMode) {
            this.data.mower.mode = newMode;
            this.mode = newMode;
            updatedFields.push("mode");
        }

        let newActivity = MowerActivity[stateJson.mower.activity];
        if (this.activity != newActivity) {
            this.data.mower.activity = newActivity;
            this.activity = newActivity;
            updatedFields.push("activity");
        }

        let newState = MowerState[stateJson.mower.state];
        if (this.state != newState) {
            this.data.mower.state = newState
            this.state = newState;
            updatedFields.push("state");
        }

        let newErrorCode = +stateJson.mower.errorCode;
        if (this.errorCode != newErrorCode) {
            this.data.mower.errorCode = newErrorCode;
            this.errorCode = newErrorCode;
            updatedFields.push("errorCode");
        }

        let newErrorCodeTimestamp = Moment(stateJson.mower.errorCodeTimestamp);
        if (this.errorCodeTimestamp != newErrorCodeTimestamp) {
            this.data.mower.errorCodeTimestamp = stateJson.mower.errorCodeTimestamp;
            this.errorCodeTimestamp = newErrorCodeTimestamp;
            updatedFields.push("errorCodeTimestamp");
        }

        let newNextStartTimestamp = Moment(stateJson.planner.nextStartTimestamp);
        if (this.nextStartTimestamp != newNextStartTimestamp) {
            this.data.planner.nextStartTimestamp = +stateJson.planner.nextStartTimestamp;
            this.nextStartTimestamp = newNextStartTimestamp;
            updatedFields.push("nextStartTimestamp");
        }

        let newAction = OverrideAction[stateJson.planner.override.action];
        if (this.overrideAction != newAction) {
            this.data.planner.override.action = newAction;
            this.overrideAction = newAction;
            updatedFields.push("overrideAction");
        }

        let newRestrictedReason = RestrictedReason[stateJson.planner.restrictedReason];
        if (this.restrictedReason != newRestrictedReason) {
            this.data.planner.restrictedReason = newRestrictedReason;
            this.restrictedReason = newRestrictedReason;
            updatedFields.push("restrictedReason");
        }

        let newConnected = stateJson.metadata.connected;
        if (this.isConnected != newConnected) {
            this.data.metadata.connected = newConnected;
            this.isConnected = newConnected;
            updatedFields.push("isConnected");
        }

        let newStatusTimestamp = Moment(stateJson.metadata.statusTimestamp);
        if (this.statusTimestamp != newStatusTimestamp) {
            this.data.metadata.statusTimestamp = stateJson.metadata.statusTimestamp;
            this.statusTimestamp = newStatusTimestamp;
            updatedFields.push("isConnected");
        }

        return updatedFields;

    }

    private processPositionEvent(posJson: AutoMowerWebSocketPositionData) {
        const positionsJson = posJson.positions as AutoMowerPosition[];

        this.data.positions = [];

        positionsJson.forEach((pos) => {
            this.data.positions.unshift(pos);
        });

        if (this.data.positions.length > 50) {
            this.data.positions.slice(49, this.data.positions.length - 1);
        }
    }

    public onStartRealtimeUpdates(func: () => void): this {
        return this.on('startWSUpdates', func);
    }

    public onStopRealtimeUpdates(func: () => void): this {
        return this.on('stopWSUpdates', func);
    }

    public onUpdate(func: (updatedValues: string[]) => void): this {
        return this.on('wsUpdate', func);
    }

    public async pauseMower(): Promise<void> {
        await this.command(AutoMowerCommand.Pause);
    }

    public async parkUntilNextSchedule(): Promise<void> {
        await this.command(AutoMowerCommand.ParkUntilNextSched);
    }

    public async parkUntilFurtherNotice(): Promise<void> {
        await this.command(AutoMowerCommand.ParkUntilFurtherNotice);
    }

    public async parkForDurationOfTime(minutes: number): Promise<void> {
        await this.command(AutoMowerCommand.Park, minutes);
    }

    public async resumeSchedule(): Promise<void> {
        await this.command(AutoMowerCommand.ResumeSchedule);
    }

    public async startMowing(minutes?: number): Promise<void> {
        await this.command(AutoMowerCommand.Start, minutes);
    }

    private async command(command: AutoMowerCommand, minutes?: number, workAreaId?: number): Promise<void> {
        try {
            const body: any = {
                data: {
                    type: command
                }
            };

            // Add minutes to body if provided
            if (minutes) {
                body.data.attributes = {
                    duration: minutes
                };
            }

            // Add work area id to body if provided
            if (workAreaId) {
                body.data.attributes.workAreaId = workAreaId;
            }

            // Request
            await this.connection.apiRequest(`${API_BASE}/mowers/${this.id}/actions`, null, 'POST', body, 202, ApiOutput.Text);
        } catch (e) {
            throw new AutoConnectApiError(`Couldn't execute action command` + e);
        }
    }

    public get error(): MowerErrorCode {
        // If currently in warning/error state, return the latest known error
        if ((this.data.mower.state == MowerState.ERROR || this.data.mower.state == MowerState.FATAL_ERROR) && this.lastErrorCode) {
            return this.lastErrorCode;
        }

        return null;
    }
}