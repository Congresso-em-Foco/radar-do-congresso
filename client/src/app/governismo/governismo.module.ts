import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { GovernismoComponent } from './governismo.component';
import { SharedModule } from '../shared/components/shared.module';
import { GovernismoRoutingModule } from './governismo-routing.module';

@NgModule({
  declarations: [GovernismoComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    GovernismoRoutingModule
  ]
})
export class GovernismoModule { }
