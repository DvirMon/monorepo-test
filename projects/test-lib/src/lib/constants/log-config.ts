import { InjectionToken } from "@angular/core";
import { LoggerConfig } from "../models/log-types";

export const LOGS_CONFIGURATION = new InjectionToken<LoggerConfig>('LOGS_CONFIGURATION');
