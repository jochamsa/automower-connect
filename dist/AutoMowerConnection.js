import fetch from 'node-fetch';
import { API_BASE } from './config.js';
import { AutoConnectAuth } from './AutoMowerAuth.js';
import { AutoMower } from './AutoMower.js';
import WebSocket from 'ws';
export class AutoConnectApiError extends Error {
}
export var ApiOutput;
(function (ApiOutput) {
    ApiOutput["Json"] = "json";
    ApiOutput["Text"] = "txt";
})(ApiOutput || (ApiOutput = {}));
export class AutoMowerConnection {
    auth;
    mowers;
    ws;
    keepWsAlive;
    constructor(config) {
        this.auth = new AutoConnectAuth({ apiKey: config.apiKey, clientSecret: config.clientSecret });
    }
    async getMower(id) {
        if (!this.mowers) {
            await this.updateMowersList();
        }
        return this.mowers.find((mower) => mower.id == id);
    }
    async getMowers() {
        if (!this.mowers) {
            await this.updateMowersList();
        }
        return this.mowers;
    }
    async updateMowersList() {
        // Reset locations list
        this.mowers = [];
        // Get locations
        try {
            const res = (await this.apiRequest(`${API_BASE}/mowers`));
            if (res.data) {
                for (const loc of res.data) {
                    // Add to cached list of locations
                    this.mowers.push(new AutoMower(this, loc.id, loc));
                }
            }
            else {
                throw new AutoConnectApiError('No locations found');
            }
        }
        catch (e) {
            throw new AutoConnectApiError('Failed to get locations from AutoConnect API', { cause: e });
        }
    }
    async apiRequest(url, headers, method = 'GET', body, expectedStatus = 200, expectedOutput = ApiOutput.Json) {
        try {
            // Add header when json body object is provided
            let bodyHeader;
            if (body && typeof body === 'object') {
                bodyHeader = { 'Content-Type': 'application/vnd.api+json' };
                body = JSON.stringify(body);
            }
            // Combine Auth headers with provided ones
            const combinedHeaders = {
                ...bodyHeader,
                ...headers,
                ...{
                    Authorization: `Bearer ${await this.auth.getValidAccessToken()}`,
                    'X-Api-Key': this.auth.apiKey,
                    'Authorization-Provider': 'husqvarna'
                }
            };
            // Request with authorization headers
            const res = await fetch(url, {
                method: method,
                headers: combinedHeaders,
                body: body
            });
            // Check status
            if (res.status != expectedStatus) {
                throw new AutoConnectApiError(`Unexpected status ${res.status} on ${method} on ${url.toString()} on the Automower Connect API`);
            }
            // Get output
            let output = await res.text();
            // Parse json if needed
            if (expectedOutput == ApiOutput.Json) {
                output = JSON.parse(output);
            }
            // Return output
            return output;
        }
        catch (e) {
            throw new AutoConnectApiError(`Failed to get response from ${method} on ${url.toString()} on the Automower Connect API` + e);
        }
    }
    async activateRealtimeUpdates() {
        this.keepWsAlive = true;
        // Destroy the already active websocket
        if (this.ws) {
            try {
                this.ws.terminate();
            }
            catch (e) { }
        }
        // Get initial list of devices if not already done
        if (!this.mowers) {
            await this.updateMowersList();
        }
        // Create request body
        const body = {
            headers: {
                Authorization: `Bearer ${await this.auth.getValidAccessToken()}`
            }
        };
        const url = 'wss://ws.openapi.husqvarna.dev/v1';
        // Setup websocket
        try {
            this.ws = new WebSocket(url, body);
        }
        catch (e) {
            throw new AutoConnectApiError(`Couldn't setup websocket with AUtomower COnnect API`);
        }
        // Subscribe to events if websocket was succesfully created
        if (this.ws) {
            let pingInterval;
            this.ws.on('open', () => {
                // Emit 'startWSUpdates' event on each device when websocket is opened
                for (const device of this.mowers) {
                    device.emit('startWSUpdates');
                }
                // Send regular heartbeat to keep the connection open
                pingInterval = setInterval(() => {
                    this.ws.ping((err) => {
                        if (err) {
                            // Didn't recieve a timely pong from the server. So assuming the connection is dead and needs to be reopened
                            this.ws.terminate();
                            checkClose();
                        }
                    });
                }, 150000); // 150 seconds
            });
            this.ws.on('message', (data) => {
                // Parse JSON
                let json;
                try {
                    json = JSON.parse(data.toString());
                    console.log(`WsSocket: ${data.toString()}`);
                }
                catch (e) {
                    throw new AutoConnectApiError(`Received websocket message, but couldn't decode as JSON: ${data.toString()}`);
                }
                if (json.ready) {
                    this.mowers.forEach(mower => {
                        mower.emit('wsUpdate', ["connect"]);
                    });
                }
                else {
                    // Check if linked to device
                    // First by checking the id of the message
                    let matchedDevice = this.mowers.find((x) => {
                        return x.id.includes(json.id);
                    });
                    var updateList = [];
                    if (matchedDevice) {
                        updateList = matchedDevice.processWsAttributes(json.attributes);
                        // Emit event with attributes
                        matchedDevice.emit('wsUpdate', updateList);
                    }
                }
            });
            const checkClose = async () => {
                clearInterval(pingInterval);
                // Emit 'stopWSUpdates' event on each device when websocket is closed
                for (const device of this.mowers) {
                    device.emit('stopWSUpdates');
                }
                // Reinitiate websocket
                if (this.keepWsAlive) {
                    //await this.updateDevicesList();
                    await this.activateRealtimeUpdates();
                }
            };
            this.ws.on('close', checkClose);
        }
    }
    async deactivateRealtimeUpdates() {
        this.keepWsAlive = false;
        this.ws.close();
    }
}
//# sourceMappingURL=AutoMowerConnection.js.map