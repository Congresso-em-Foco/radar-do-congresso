import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/components/shared.module';
import { VotacoesImportantesRoutingModule } from './votacoes-importantes-routing.module';

import { VotacoesImportantesComponent } from './votacoes-importantes.component';

@NgModule({
  declarations: [VotacoesImportantesComponent],
  imports: [
    CommonModule,
    SharedModule,
    VotacoesImportantesRoutingModule
  ]
})
export class VotacoesImportantesModule { }
