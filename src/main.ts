import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  ...appConfig, // ✅ Spread your existing config
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    provideCharts(withDefaultRegisterables()),
    ...(appConfig.providers || []),
  ],
}).catch((err) => console.error(err));
