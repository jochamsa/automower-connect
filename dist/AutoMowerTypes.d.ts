export type AutoMowerSystem = {
    name: string;
    model: string;
    serialNumber: number;
};
export type AutoMowerBattery = {
    batteryPercent: number;
};
export type AutoMowerCapabilities = {
    position: boolean;
    headlights: boolean;
    workAreas: boolean;
    stayOutZones: boolean;
};
export type AutoMowerMowerApp = {
    mode: string;
    activity: string;
    state: string;
    errorCode: number;
    errorCodeTimestamp: number;
};
export type AutoMowerCalendar = {
    tasks: {
        start: number;
        duration: number;
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        sunday: boolean;
    }[];
};
export type AutoMowerPlanner = {
    nextStartTimestamp: number;
    override: {
        action: string;
    };
    restrictedReason: string;
    externalReason: number;
};
export type AutMowerMetadata = {
    connected: boolean;
    statusTimestamp: number;
};
export type AutoMowerPosition = {
    latitude: number;
    longitude: number;
};
export type AutoMowerSettings = {
    cuttingHeights: number;
    headlight: {
        mode: string;
    };
};
export type AutoMowerStatistics = {
    cuttingBladeUsageTime: number;
    numberOfChargingCycles: number;
    numberOfCollisions: number;
    totalChargingTime: number;
    totalCuttingTime: number;
    totalDrivenDistance: number;
    totalRunningTime: number;
    totalSearchingTime: number;
};
export type AutoMowerStayOutZone = {
    id: string;
    name: string;
    enabled: boolean;
};
export type AutoMowerStayOutZones = {
    dirty: boolean;
    zones: AutoMowerStayOutZone[];
};
export type AutoMowerWorkArea = {
    workAreaId: number;
    name: string;
    cuttingHeight: number;
};
export type AutoMowerData = {
    system: AutoMowerSystem;
    battery: AutoMowerBattery;
    capabilities: AutoMowerCapabilities;
    mower: AutoMowerMowerApp;
    calendar: AutoMowerCalendar;
    planner: AutoMowerPlanner;
    metadata: AutMowerMetadata;
    positions: AutoMowerPosition[];
    settings: AutoMowerSettings;
    statistics: AutoMowerStatistics;
    stayOutZones: AutoMowerStayOutZones;
    workAreas: AutoMowerWorkArea[];
};
