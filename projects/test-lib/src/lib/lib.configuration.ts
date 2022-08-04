import { LogConfig, LogMessage } from "./models/log-types";

export class LibConfig {
  production!: boolean
  logConfig?: LogConfig
}
