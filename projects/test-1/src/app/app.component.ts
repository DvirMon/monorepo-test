import { Component, inject } from '@angular/core';
import { LoggerService } from 'projects/test-lib/src/public-api';

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

    this.loggerService.getItems().subscribe({ next: (val) => console.log(val) })
  }

  onThrowError(): void {
    this.errorCount += 1
    throw Error('TEST ERROR: ' + this.errorCount)
  }
}
