import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransparenciaComponent } from './transparencia.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'senado'
  },
  {
    path: ':casa',
    component: TransparenciaComponent,
    data: { animation: 'TransparenciaComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransparenciaRoutingModule { }
