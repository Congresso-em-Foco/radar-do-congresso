import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';
import { GastosCeapComponent } from './gastos-ceap/gastos-ceap.component';
import { DiscursosComponent } from './discursos/discursos.component';

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
        path: 'discursos',
        component: DiscursosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
