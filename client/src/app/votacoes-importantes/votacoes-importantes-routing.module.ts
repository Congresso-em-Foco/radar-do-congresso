import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotacoesImportantesComponent } from './votacoes-importantes.component';

const routes: Routes = [
  {
    path: '',
    component: VotacoesImportantesComponent,
    data: { animation: 'VotacoesImportantesComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotacoesImportantesRoutingModule { }
