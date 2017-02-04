import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { ProgramModule } from './program.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(ProgramModule);
