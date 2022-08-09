import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from "@angular/core"

import { LOGS_CONFIGURATION } from '../constants/log-config';
import { ENV_PRODUCTION } from '../constants/env-production';
;
import { LogConfig, LogMessage } from '../models/log-types';
import { Queue } from '../models/queue';

import { concatMap, filter, finalize, interval, map, merge, Observable, of, Subject, Subscription, takeUntil, tap, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggerService<T = any> implements OnDestroy {

  constructor(
    @Inject(ENV_PRODUCTION) private production: boolean,
    @Inject(LOGS_CONFIGURATION) private logConfig: LogConfig
  ) {
  }


  private _obsQueue$ = new Subject<Observable<T | LogMessage>>();

  private errorQue: Queue<T> = new Queue<T>();
  private error$: Subject<Error> = new Subject()
  private destroy$: Subject<void> = new Subject()

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  public add(error: Error): void {
    this._enqueue(this._setLog(error));
  }

  private _enqueue(log: T | LogMessage): void {
    console.log('[QUEUING]')
    console.log(log)
    const subject = timer(3000).pipe(map(x => log));
    this._obsQueue$.next(subject)

  }

  private process() : Subscription{
    return this._obsQueue$
      .pipe(
        concatMap(log => log)
        )
      .subscribe(log => {
        console.log('[PROCESSED]', log)
      });

  }

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

  private _setLog(error: Error): T {
    const { formatMessage } = this.logConfig
    return formatMessage!(error)

  }

  setLog(error: Error): void {
    this.errorQue.enqueue(this._setLog(error))
    this.error$.next(error)
  }

  logger(): Subscription {

    // const dev$ = this.error$.pipe(
    //   filter(() => !this.production),
    //   tap(() => console.log('LoggerServer only works on production')),
    //   map(() => { })
    // )

    // this.error$.pipe(
    //   filter(() => this.production),
    //   map((error) => this.errorQue.enqueue(this._setLog(error))
    //   )

    // )

    // const prod$ = interval(this.logConfig.interval).pipe(
    //   filter(() => this.errorQue.size() > 0 && this.production),
    //   tap(() => console.log('interval for ', this.logConfig.interval, ' seconds')),
    //   map(() => this._write()))

    // const source$ = merge(prod$, dev$).pipe(takeUntil(this.destroy$))


    // return source$.subscribe()

    return this.process()
  }

  private _write(): void {
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
