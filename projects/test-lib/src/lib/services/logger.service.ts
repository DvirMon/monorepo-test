import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from "@angular/core"

import { LOGS_CONFIGURATION } from '../constants/log-config';
import { ENV_PRODUCTION } from '../constants/env-production';
;
import { LogConfig, LogMessage } from '../models/log-types';
import { Queue } from '../models/queue';

import { concatAll, concatMap, delay, filter, finalize, interval, map, merge, Observable, of, Subject, Subscription, takeUntil, tap, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggerService<T = any> implements OnDestroy {



  private _queue = new Subject<Observable<T>>();
  private _items$!: Observable<T>
  private _destroy$: Subject<void> = new Subject()

  constructor(
    @Inject(ENV_PRODUCTION) private production: boolean,
    @Inject(LOGS_CONFIGURATION) private logConfig: LogConfig
  ) {
    this._items$ = this._queue.pipe(concatAll());
  }


  ngOnDestroy(): void {
    this._destroy$.next();
  }

  private _setLog(error: Error): T {
    const { formatMessage } = this.logConfig;
    return formatMessage!(error);
  }

  private _setLogObservable(error: Error): Observable<T> {
    return of(this._setLog(error)).pipe(delay(this.logConfig.interval!));
  }

  add(error: Error): void {

    if (this.production) {
      const log$ = this._setLogObservable(error);
      this._queue.next(log$);
    } else {
      console.log('Logger Service only works on production');
    }
  }

  private _write(log: T): void {
    const { target } = this.logConfig;
    switch (target) {
      case 'storage':
        this._writeToLocalStorage(log);
        break;
      case 'console':
        this._writeToConsole(log);
        break;
      default:
        this._writeToLocalStorage(log);
        this._writeToConsole(log);
    }
  }

  private _process(): Subscription {

    return this._items$
      .pipe(
        filter(() => this.production),
        tap(() => console.log(this.logConfig.interval! / 1000, 'sec pass')),
        takeUntil(this._destroy$)
      )
      .subscribe({ next: (val) => this._write(val) },);
  }

  private _writeToConsole(logs: Queue<T> | T): void {
    console.log('%cLogger Service :', 'font-weight : 600', logs);
  }

  private _writeToLocalStorage(logs: Queue<T> | T): void {
    localStorage.setItem('log', JSON.stringify(logs));
  }

  logger(): Subscription {
    return this._process();
  }


  // handleBackendError(err: HttpErrorResponse): LogMessage {
  //   const error = new Error(err.message)
  //   const { stack, message } = error
  //   return {
  //     message,
  //     stackTrace: stack || 'SERVER ERROR - NO STACK EXIST',
  //     timeStamp: new Date()
  //   };
  // }



}
