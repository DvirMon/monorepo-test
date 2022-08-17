import { discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { ENV_PRODUCTION } from '../constants/env-production';
import { LoggerConfig } from '../models/log-types';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let logger: LoggerService;
  let error: Error

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ENV_PRODUCTION,
          useValue: true
        },
        {
          provide: LoggerConfig,
          useValue: new LoggerConfig()
        }
      ]
    });
    logger = TestBed.inject(LoggerService);
    error = new Error('Test Error')
  });

  it('should be created', () => {
    expect(logger).toBeTruthy();
  });

  it('config should be with default values', () => {
    const config = logger.getConfiguration();
    expect(config).toBeTruthy();
    expect(config.interval).toBe(5000);
    expect(config.queue).toBe(true);
    expect(config.target).toBe(undefined);
  });

  fit('logger add method should emit error object', fakeAsync(() => {

    const config = logger.getConfiguration();
    const queue$ = logger.getItems()

    queue$.subscribe({
      next: (val) => {

        const { message } = val

        expect(val).toBeTruthy();
        expect(message).toEqual('Test Error');
      }
    });

    logger.add(error);

    tick(config.interval)

  }));
});

