import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgxPaginationModule } from 'ngx-pagination';

import { TransparenciaComponent } from './transparencia.component';
import { SharedModule } from '../shared/components/shared.module';
import { TransparenciaRoutingModule } from './transparencia-routing.module';

@NgModule({
  declarations: [TransparenciaComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    TransparenciaRoutingModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
  ]
})
export class TransparenciaModule { }
