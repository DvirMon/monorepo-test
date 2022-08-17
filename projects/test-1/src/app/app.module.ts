import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TestErrorsService } from 'projects/test-lib/src/lib/services/error.service';
import { HttpErrorInterceptor } from './error.interceptor';

import { TestLibModule } from 'projects/test-lib/src/public-api';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TestLibModule.forRoot({ production: !environment.production }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: TestErrorsService,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
