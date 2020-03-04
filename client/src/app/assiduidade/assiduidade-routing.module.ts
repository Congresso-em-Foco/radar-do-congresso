import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssiduidadeComponent } from './assiduidade.component';

const routes: Routes = [
  {
    path: '',
    component: AssiduidadeComponent,
    data: { animation: 'AssiduidadeComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssiduidadeRoutingModule { }
