import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';
import { GastosCeapComponent } from './gastos-ceap/gastos-ceap.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { DiscursosComponent } from './discursos/discursos.component';
import { EleicaoComponent } from './eleicao/eleicao.component';

const routes: Routes = [
  {
    path: ':id',
    component: ParlamentarComponent,
    data: { animation: 'ParlamentarComponent' },
    children: [
      {
        path: 'proposicoes',
        component: ProposicoesComponent
      },
      {
        path: 'gastos-ceap',
        component: GastosCeapComponent
      },
      {
        path: 'votacoes',
        component: VotacoesComponent
      },
      {
        path: 'discursos',
        component: DiscursosComponent
      },
      {
        path: 'eleicao',
        component: EleicaoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
