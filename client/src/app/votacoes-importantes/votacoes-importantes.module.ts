import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { SharedModule } from '../shared/components/shared.module';
import { VotacoesImportantesRoutingModule } from './votacoes-importantes-routing.module';

import { VotacoesImportantesComponent } from './votacoes-importantes.component';

@NgModule({
  declarations: [VotacoesImportantesComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    VotacoesImportantesRoutingModule
  ]
})
export class VotacoesImportantesModule { }
