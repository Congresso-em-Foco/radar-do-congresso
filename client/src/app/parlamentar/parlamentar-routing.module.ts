import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';
import { GastosCeapComponent } from './gastos-ceap/gastos-ceap.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
