export interface LogMessage {

  message?: string
  stackTrace?: string,
  timeStamp?: Date
}

export interface LogConfig<T = any> {

  target?: 'console' | 'storage' | undefined,
  interval?: number
  queue?: boolean,
  formatMessage?: (data?: any) => T,
}

export class LoggerConfig<T = any | LogMessage> implements LogConfig<T | LogMessage> {

  target: 'console' | 'storage' | undefined;
  interval!: number
  queue!: boolean
  formatMessage?: (data?: any) => T | LogMessage

  constructor(
    options?: {
      target?: 'console' | 'storage' | undefined,
      interval?: number,
      queue?: boolean,
      formatMessage?: (data?: any) => T | LogMessage
    }
  ) {
    this.target = options?.target
    this.interval = options?.interval || 5000
    this.queue = options?.queue === false ? false : true
    this.formatMessage = options?.formatMessage || this._formatMessage
  }

  private _formatMessage(error: Error): LogMessage {
    const timeStamp = new Date()
    const { message, stack } = error
    return { message, stackTrace: stack, timeStamp } as LogMessage
  }


}
