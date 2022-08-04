import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from "@angular/core"

import { LOGS_CONFIGURATION } from '../constants/log-config';
import { ENV_PRODUCTION } from '../constants/env-production';
;
import { LogConfig, LogMessage } from '../models/log-types';
import { Queue } from '../models/queue';

import { filter, interval, map, merge, Observable, of, switchMap, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggerService<T = any> {

  constructor(
    @Inject(ENV_PRODUCTION) private production: boolean,
    @Inject(LOGS_CONFIGURATION) private logConfig: LogConfig
  ) {
  }

  private errorQue: Queue<T> = new Queue<T>();

  private _writeToConsole(logs: Queue<T> | T): void {
    console.log('%cLogger Service :', 'font-weight : 600', logs)
  }

  private _writeToLocalStorage(logs: Queue<T> | T): void {
    localStorage.setItem('log', JSON.stringify(logs))
  }

  handleBackendError(err: HttpErrorResponse): LogMessage {
    const error = new Error(err.message)
    const { stack, message } = error
    return {
      message,
      stackTrace: stack || 'SERVER ERROR - NO STACK EXIST',
      timeStamp: new Date()
    };
  }

  emit(error: Error): void {
    const { formatMessage } = this.logConfig
    const log = formatMessage!(error)
    this.errorQue.enqueue(log)



  }

  logger(): Observable<void> {

    const source = interval(this.logConfig.interval)


    console.log(this.production)
    const dev = of(this.production).pipe(
      // filter(() => !this.production),
      tap(() => console.log('Logger Service only works on production')),
      map(() => { })
    )

    const prod = source.pipe(
      filter(() => this.production),
      filter(() => this.errorQue.size() > 0),
      tap(() => console.log('interval for ', this.logConfig.interval, ' seconds')),
      map(() => { }))


    return dev
  }

  write(): void {
    const { target, queue } = this.logConfig
    const log = queue ? this.errorQue : this.errorQue.dequeue()!

    switch (target) {
      case 'storage':
        this._writeToLocalStorage(log)
        break;
      case 'console':
        this._writeToConsole(log)
        break;
      default:
        this._writeToLocalStorage(log)
        this._writeToConsole(log)
    }
  }






}
