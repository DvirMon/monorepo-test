import { ModuleWithProviders, NgModule } from '@angular/core';
import { LibConfig } from './lib.configuration';
import { LoggerConfig } from './models/log-types';

import { ENV_PRODUCTION } from './constants/env-production';



@NgModule({
  declarations: [
  ],
  imports: [
  ],
  exports: [
  ]
})
export class TestLibModule {


  static forRoot({ production, logConfig }: LibConfig): ModuleWithProviders<any> {

    return {
      ngModule: TestLibModule,
      providers: [
        {
          provide: ENV_PRODUCTION,
          useValue: production // only for testing
        },
        {
          provide: LoggerConfig,
          useValue: new LoggerConfig({ ...logConfig })
        }
      ]
    };
  }

}
