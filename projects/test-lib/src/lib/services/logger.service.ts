import { Inject, Injectable, OnDestroy } from "@angular/core"

import { ENV_PRODUCTION } from '../constants/env-production';
;
import { LogConfig, LoggerConfig } from '../models/log-types';
import { Queue } from '../models/queue';

import { BehaviorSubject, concatAll, delay, filter, mergeAll, Observable, of, Subject, Subscription, takeUntil, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoggerService<T = any> implements OnDestroy {

  private _queue$ = new Subject<Observable<T>>();
  private _items$!: Observable<T>
  private _destroy$: Subject<void> = new Subject()

  constructor(
    @Inject(ENV_PRODUCTION) private production: boolean,
    private logConfig: LoggerConfig
  ) {
    this._items$ = this._queue$.pipe(concatAll());
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
      this._queue$.next(log$);
    } else {
      console.log('Logger Service only works on production');
    }
  }

  private _writeToConsole(logs: Queue<T> | T): void {
    console.log('%cLogger Service :', 'font-weight : 600', logs);
  }

  private _writeToLocalStorage(logs: Queue<T> | T): void {
    localStorage.setItem('log', JSON.stringify(logs));
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


  log(): Subscription {
    return this._process();
  }

  getItems(): Observable<T> {
    return this._items$
  }

  getConfiguration(): LoggerConfig {
    return { ...this.logConfig } as LoggerConfig
  }

}
