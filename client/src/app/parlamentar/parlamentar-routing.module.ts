import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';

const routes: Routes = [
  {
    path: ':id',
    component: ParlamentarComponent,
    data: { animation: 'ParlamentarComponent' },
    children: [
      {
        path: 'proposicoes',
        component: ProposicoesComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
