export enum MowerState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  PAUSED = 'PAUSED',
  IN_OPERATION = 'IN_OPERATION',
  WAIT_UPDATING = 'WAIT_UPDATING',
  WAIT_POWER_UP = 'WAIT_POWER_UP',
  RESTRICTED = 'RESTRICTED',
  OFF = 'OFF',
  Stopped = 'Stopped',
  ERROR = 'ERROR',
  FATAL_ERROR = 'FATAL_ERROR',
  ERROR_AT_POWER_UP = 'ERROR_AT_POWER_UP'
}

export enum AutoMowerCommand {
  Start = 'Start',
  Pause = 'Pause',
  ResumeSchedule = 'ResumeSchedule',
  ParkUntilNextSched = 'ParkUntilNextSchedule',
  ParkUntilFurtherNotice = 'ParkUntilFurtherNotice',
  Park = 'Park'
}

export enum MowerActivity {
  UNKNOWN = 'UNKNOWN',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  MOWING = 'MOWING',
  GOING_HOME = 'GOING_HOME',
  CHARGING = 'CHARGING',
  LEAVING = 'LEAVING',
  PARKED_IN_CS = 'PARKED_IN_CS',
  STOPPED_IN_GARDEN = 'STOPPED_IN_GARDEN'
}

export enum HusqvarnaMowerErrorCode {
  UnexpectedError = 0,
  OutsideWorkingArea = 1,
  NoLoopSignal = 2,
  WrongLoopSignal = 3,
  LoopSensorProblemFront = 4,
  LoopSensorProblemRear = 5,
  LoopSensorProblemLeft = 6,
  LoopSnsorProblemRight = 7,
  WrongPinCode = 8,
  Trapped = 9,
  UpsideDown = 10,
  LowBattery = 11,
  EmptyNattery = 12,
  NoDrive = 13,
  MowerLifted = 14,
  Lifted = 15,
  StuckInChargingStation = 16,
  ChargingStationBlocked = 17,
  CollisionSensorProblemRear = 18,
  CollisionSensorProblemFront = 19,
  WheelMotorBlockedRight = 20,
  WheelMotorBlockedLeft = 21,
  WheelDriveProblemRight = 22,
  WheelDriveProblemLeft = 23,
  CuttingSystemBlocked = 24,
  CuttingSystemBlocked1 = 25,
  InvalidSubDeviceCombination = 26,
  SettingsRestored = 27,
  MemoryCircuitProblem = 28,
  SlopTooSteep = 29,
  ChargingSystemProblem = 30,
  StopButtonProblem = 31,
  TiltSensorProblem = 32,
  MowerTilted = 33,
  CuttingStoppedSlopeTooSteep = 34,
  WheelMotorOverloadedRight = 35,
  WheelMotorOverloadedReft = 36,
  ChargingCurrentTooHigh = 37,
  ElectronicProblem = 38,
  CuttingMotorProblem = 39,
  LimitedCuttingHeightRange = 40,
  UnexpectedCuttingHeightAdj = 41,
  LimitedCuttingHeightRange1 = 42,
  CuttingHeightProblemDrive = 43,
  CuttingHeightProblemCurr = 44,
  CuttingHeightProblemDir = 45,
  CuttingHeightBlocked = 46,
  CuttingHeightProblem = 47,
  NoResponseFromCharger = 48,
  UltrasonicProblem = 49,
  Guide1NotFound = 50,
  Guide2NotFound = 51,
  Guide3NotFound = 52,
  GpsNavigationProblem = 53,
  WeakGpsSignal = 54,
  DifficultFindingHome = 55,
  GuideCalibrationAccomplished = 56,
  GuideCalibrationFailed = 57,
  TemporaryBatteryProblem = 58,
  TemporaryBatteryProblem1 = 59,
  TemporaryBatteryProblem2 = 60,
  TemporaryBatteryProblem3 = 61,
  TemporaryBatteryProblem4 = 62,
  TemporaryBatteryProblem5 = 63,
  TemporaryBatteryProblem6 = 64,
  TemporaryBatteryProblem7 = 65,
  BatteryProblem = 66,
  BatteryProblem1 = 67,
  TemporaryBatteryProblem8 = 68,
  AlarmMowerSwitchedOff = 69,
  AlarmMowerStopped = 70,
  AlarmMowerLifted = 71,
  AlarmMowerTilted = 72,
  AlarmMowerInMotion = 73,
  AlarmOutsideGeofence = 74,
  ConnectionChanged = 75,
  ConnectionNotChanged = 76,
  ComBoardNotAvailable = 77,
  SlippedMMowerHasSlippedSituationNotSolv = 78,
  InvalidBatteryCombinationInvalidCombinat = 79,
  CuttingSystemIimbalanceWarning = 80,
  SafetyFunctionFaulty = 81,
  WheelMotorBlockedRearRight = 82,
  WheelMotorBlockedRearLeft = 83,
  WheelDriveProblemRearRight = 84,
  WheelDriveProblemRearLeft = 85,
  WheelMotorOverloadedRearRight = 86,
  WheelMotorOverloadedRearLeft = 87,
  AngularSensorProblem = 88,
  InvalidSystemConfiguration = 89,
  NoPowerInChargingStation = 90,
  SwitchCordProblem = 91,
  WorkAreaNotValid = 92,
  NoAccuratePositionFromSatellites = 93,
  ReferenceStationCommunicationProblem = 94,
  FoldingSensorActivated = 95,
  RightBrushMotorOverloaded = 96,
  LeftBrushMotorOverloaded = 97,
  UltrasonicSensor1Defect = 98,
  UltrasonicSensor2Defect = 99,
  UltrasonicSensor3Defect = 100,
  UltrasonicSensor4Defect = 101,
  CuttingDriveMotor1Defect = 102,
  CuttingDriveMotor2Defect = 103,
  CuttingDriveMotor3Defect = 104,
  LiftSensorDefect = 105,
  CollisionSensorDefect = 106,
  DockingSensorDefect = 107,
  FoldingCuttingDeckSensorDefect = 108,
  LoopSensorDefect = 109,
  CollisionSensorError = 110,
  NoConfirmedPosition = 111,
  CuttingSystemMajorImbalance = 112,
  ComplexWorkingArea = 113,
  TooHighDischargeCurrent = 114,
  TooHighInternalCurrent = 115,
  HighChargingPowerLoss = 116,
  HighInternalPowerLoss = 117,
  ChargingSystemProblem1 = 118,
  ZoneGeneratorProblem = 119,
  InternalVoltageError = 120,
  HighInternalTemerature = 121,
  CanError = 122,
  DestinationNotReachable = 123,
  DestinationBlocked = 124,
  BatteryNeedsReplacement = 125,
  BatteryNearEndOfLife = 126,
  BatteryProblem2 = 127,
  ConnectivityProblem = 701,
  ConnectivitySettingsRestored = 702,
  ConnectivityPoroblem1 = 703,
  ConnectivityPoroblem2 = 704,
  ConnectivityPoroblem3 = 705,
  PoorSignalQuality = 706,
  SimCardRequiresPin = 707,
  SimCardLocked = 708,
  SimCardNotFound = 709,
  SimCardLocked1 = 710,
  SimCardLocked2 = 711,
  SimCardLocked3 = 712,
  GeofenceProblem = 713,
  GeofenceProblem1 = 714,
  ConnectivityProblem1 = 715,
  ConnectivityProblem2 = 716,
  SmsCouldNotBeSent = 717,
  CommunicationCircuitBoardSwMustBeUpdated = 724

}

export enum MowerMode {
  MAIN_AREA = 'MAIN_AREA',
  DEMO = 'DEMO',
  SECONDARY_AREA = 'SECONDARY_AREA',
  HOME = 'HOME',
  UNKNOWN = 'UNKNOWN',
  POI = 'POI'
}
export enum OverrideAction {
  NOT_ACTIVE = 'NOT_ACTIVE',
  FORCE_PARK = "FORCE_PARK",
  FORCE_MOW = 'FORCE_MOW'
}

export enum RestrictedReason {
  NONE = 'NONE',
  WEEK_SCHEDULE = 'WEEK_SCHEDULE',
  PARK_OVERRIDE = 'PARK_OVERRIDE',
  SENSOR = 'SENSOR',
  DAILY_LIMIT = 'DAILY_LIMIT',
  FOTA = 'FOTA',
  FROST = 'FROST',
  ALL_WORK_AREAS_COMPLETED = 'ALL_WORK_AREAS_COMPLETED',
  EXTERNAL = 'EXTERNAL',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum HeadlightMode {
  ALWAYS_ON = 'ALWAYS_ON',
  ALWAYS_OFF = 'ALWAYS_OFF',
  EVENING_ONLY = 'EVENING_ONLY',
  EVENING_AND_NIGHT = 'EVENING_AND_NIGHT'
}
