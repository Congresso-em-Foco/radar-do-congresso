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
import { PosicaoComponent } from './posicao/posicao.component';
import { CargoComponent } from './cargo/cargo.component';
import { PosicoesComponent } from './posicoes/posicoes.component';
import { CargosComponent } from './cargos/cargos.component';
import { AderenciaComponent } from './aderencia/aderencia.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { VotacaoComponent } from './votacao/votacao.component';
import { CapitalComponent } from './capital/capital.component';
import { CapitalChartComponent } from './capital-chart/capital-chart.component';
import { TrajetoriaComponent } from './trajetoria/trajetoria.component';
import { TrajetoriaChartComponent } from './trajetoria-chart/trajetoria-chart.component';
import { ProposicoesComponent } from './proposicoes/proposicoes.component';
import { ProposicaoComponent } from './proposicoes/proposicao/proposicao.component';
import { GastosCeapComponent } from './gastos-ceap/gastos-ceap.component';

@NgModule({
  declarations: [
    ParlamentarComponent,
    PosicaoComponent,
    CargoComponent,
    PosicoesComponent,
    CargosComponent,
    AderenciaComponent,
    VotacoesComponent,
    VotacaoComponent,
    CapitalComponent,
    CapitalChartComponent,
    TrajetoriaComponent,
    TrajetoriaChartComponent,
    ProposicoesComponent,
    ProposicaoComponent,
    GastosCeapComponent
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
