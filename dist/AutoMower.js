import EventEmitter from 'events';
import Moment from 'moment';
import { API_BASE } from './config.js';
import { ApiOutput, AutoConnectApiError } from './AutoMowerConnection.js';
import { MowerMode, MowerState, MowerActivity, AutoMowerCommand, RestrictedReason, OverrideAction } from './Enums.js';
export class AutoMower extends EventEmitter {
    connection;
    id;
    data;
    lastErrorCode;
    batteryPercent;
    mode;
    activity;
    state;
    errorCode;
    errorCodeTimestamp;
    nextStartTimestamp;
    overrideAction;
    restrictedReason;
    isConnected;
    statusTimestamp;
    constructor(connection, id, data) {
        super();
        this.connection = connection;
        this.id = id;
        this.processAttributes(data.attributes);
        this.processStateEvent(data.attributes);
    }
    processAttributes(data) {
        this.data = data;
    }
    processWsAttributes(resultJson) {
        const updatedFields = [];
        if (resultJson.id == this.id) {
            switch (resultJson.type) {
                case "positions-event":
                    {
                        this.processPositionEvent(resultJson.attributes);
                        return ["positions"];
                    }
                case "status-event":
                    {
                        this.processStateEvent(resultJson.attributes);
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
    processStateEvent(stateJson) {
        const updatedFields = [];
        console.log(`newState: ${stateJson.mower.state}`);
        console.log(`${stateJson.toString()}`);
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
            this.data.mower.state = newState;
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
        console.log(`RReason: ${stateJson.planner.restrictedReason}`);
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
    processPositionEvent(posJson) {
        const positionsJson = posJson.positions;
        this.data.positions = [];
        positionsJson.forEach((pos) => {
            this.data.positions.unshift(pos);
        });
        if (this.data.positions.length > 50) {
            this.data.positions.slice(49, this.data.positions.length - 1);
        }
    }
    onStartRealtimeUpdates(func) {
        return this.on('startWSUpdates', func);
    }
    onStopRealtimeUpdates(func) {
        return this.on('stopWSUpdates', func);
    }
    onUpdate(func) {
        return this.on('wsUpdate', func);
    }
    async pauseMower() {
        await this.command(AutoMowerCommand.Pause);
    }
    async parkUntilNextSchedule() {
        await this.command(AutoMowerCommand.ParkUntilNextSched);
    }
    async parkUntilFurtherNotice() {
        await this.command(AutoMowerCommand.ParkUntilFurtherNotice);
    }
    async parkForDurationOfTime(minutes) {
        await this.command(AutoMowerCommand.Park, minutes);
    }
    async resumeSchedule() {
        await this.command(AutoMowerCommand.ResumeSchedule);
    }
    async startMowing(minutes) {
        await this.command(AutoMowerCommand.Start, minutes);
    }
    async command(command, minutes, workAreaId) {
        try {
            const body = {
                data: {
                    type: command
                }
            };
            // Add minutes to body if provided
            if (minutes) {
                body.data.attributes.duration = minutes;
            }
            // Add work area id to body if provided
            if (workAreaId) {
                body.data.attributes.workAreaId = workAreaId;
            }
            // Request
            await this.connection.apiRequest(`${API_BASE}/mowers/${this.id}/actions`, null, 'POST', body, 202, ApiOutput.Text);
        }
        catch (e) {
            throw new AutoConnectApiError(`Couldn't execute action command` + e);
        }
    }
    get error() {
        // If currently in warning/error state, return the latest known error
        if ((this.data.mower.state == MowerState.ERROR || this.data.mower.state == MowerState.FATAL_ERROR) && this.lastErrorCode) {
            return this.lastErrorCode;
        }
        return null;
    }
}
//# sourceMappingURL=AutoMower.js.map