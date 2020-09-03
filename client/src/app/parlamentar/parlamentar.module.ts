import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { GoogleChartsModule } from 'angular-google-charts';

import { SharedModule } from '../shared/components/shared.module';
import { ParlamentarRoutingModule } from './parlamentar-routing.module';

import { ParlamentarComponent } from './parlamentar.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { VotacaoComponent } from './votacao/votacao.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';
import { ProposicaoComponent } from './proposicoes/proposicao/proposicao.component';
import { GastosCeapComponent } from './gastos-ceap/gastos-ceap.component';
import { DiscursosComponent } from './discursos/discursos.component';
import { DiscursoComponent } from './discursos/discurso/discurso.component';
import { PatrimonioComponent } from './patrimonio/patrimonio.component';
import { BemComponent } from './patrimonio/bem/bem.component';
import { EleicaoComponent } from './eleicao/eleicao.component';

@NgModule({
  declarations: [
    ParlamentarComponent,
    VotacoesComponent,
    VotacaoComponent,
    PerfilComponent,
    ProposicoesComponent,
    ProposicaoComponent,
    GastosCeapComponent,
    DiscursosComponent,
    DiscursoComponent,
    PatrimonioComponent,
    BemComponent,
    EleicaoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    NgbModule,
    SharedModule,
    ParlamentarRoutingModule,
    NgxPaginationModule,
    GoogleChartsModule.forRoot()
  ]
})
export class ParlamentarModule { }
