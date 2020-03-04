import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssiduidadeComponent } from './assiduidade.component';
import { SharedModule } from '../shared/components/shared.module';
import { AssiduidadeRoutingModule } from './assiduidade-routing.module';

@NgModule({
  declarations: [AssiduidadeComponent],
  imports: [
    CommonModule,
    SharedModule,
    AssiduidadeRoutingModule
  ]
})
export class AssiduidadeModule { }
