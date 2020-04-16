import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';

import { AssiduidadeComponent } from './assiduidade.component';
import { SharedModule } from '../shared/components/shared.module';
import { AssiduidadeRoutingModule } from './assiduidade-routing.module';

@NgModule({
  declarations: [AssiduidadeComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    AssiduidadeRoutingModule
  ]
})
export class AssiduidadeModule { }
