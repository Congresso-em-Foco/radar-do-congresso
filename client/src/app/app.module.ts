import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/components/shared.module';

import { AppComponent } from './app.component';

import { ParlamentarService } from './shared/services/parlamentar.service';
import { CasaService } from './shared/services/casa.service';
import { UpdateService } from './shared/services/update.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AppRoutingModule,
    SharedModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ParlamentarService,
    CasaService,
    UpdateService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
