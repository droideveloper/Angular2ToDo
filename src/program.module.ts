import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { MainController } from './controllers/main.controller';
import { StorageImp } from './commons/storage';

@NgModule({
  declarations: [ MainController ],
  imports: [ BrowserModule, FormsModule, HttpModule, FlexLayoutModule.forRoot(), MaterialModule.forRoot() ],
  providers: [ StorageImp ],
  bootstrap: [ MainController ]
})
export class ProgramModule {}