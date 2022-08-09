import { Component, Inject, inject } from '@angular/core';
import { LOGS_CONFIGURATION } from 'projects/test-lib/src/lib/constants/log-config';
import { LogConfig } from 'projects/test-lib/src/lib/models/log-types';
import { LoggerService } from 'projects/test-lib/src/public-api';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {


  loggerService: LoggerService = inject(LoggerService)

  title = 'test-1';

  errorCount: number = 0

  constructor(

  ) {
  }


  ngOnInit() {

    this.loggerService.logger()
  }

  onThrowError(): void {
    this.errorCount += 1
    throw Error('TEST ERROR: ' + this.errorCount)
  }
}
