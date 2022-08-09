import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class TestErrorsService {
  constructor(
  ) { }


  loggerService: LoggerService = inject(LoggerService)


  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      return;
    } else {
      this.loggerService.add(error)
    }

  }
}
