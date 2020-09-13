import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GovernismoComponent } from './governismo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'camara'
  },
  {
    path: ':casa',
    component: GovernismoComponent,
    data: { animation: 'GovernismoComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernismoRoutingModule { }
