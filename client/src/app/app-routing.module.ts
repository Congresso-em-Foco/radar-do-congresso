import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'parlamentares',
    pathMatch: 'full'
  },
  { path: 'parlamentar', loadChildren: './parlamentar/parlamentar.module#ParlamentarModule' },
  { path: 'parlamentares', loadChildren: './busca-parlamentar/busca-parlamentar.module#BuscaParlamentarModule' },
  { path: 'votacoes', loadChildren: './votacoes-importantes/votacoes-importantes.module#VotacoesImportantesModule' },
  { path: 'assiduidade', loadChildren: './assiduidade/assiduidade.module#AssiduidadeModule' },
  { path: 'transparencia', loadChildren: './transparencia/transparencia.module#TransparenciaModule' },
  //{ path: 'governismo', loadChildren: './governismo/governismo.module#GovernismoModule' },
  { path: 'sobre', loadChildren: './main/main.module#MainModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
