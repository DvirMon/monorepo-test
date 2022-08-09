import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestErrorsService } from 'projects/test-lib/src/lib/services/error.service';
import { TestLibModule } from 'projects/test-lib/src/public-api';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CounterComponent } from './counter/counter.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestLibModule.forRoot({ production: !environment.production }),
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpErrorInterceptor,
    //   multi: true,
    // },
    {
      provide: ErrorHandler,
      useClass: TestErrorsService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
