import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarVotos } from 'src/app/shared/models/parlamentarVotos.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ProposicaoService } from 'src/app/shared/services/proposicao.service';
import { CasaService } from 'src/app/shared/services/casa.service';
import { Votacao } from 'src/app/shared/models/votacao.model';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  readonly FAVOR = 1;
  readonly CONTRA = -1;
  readonly ID_PADRAO_TEMA_TODOS = '99';
  readonly ID_PARTIDO_GOVERNO = 0;

  private unsubscribe = new Subject();

  parlamentar: ParlamentarVotos;
  proposicoes: Proposicao[];
  votacoes: Votacao[];

  p = 1;

  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private proposicaoService: ProposicaoService,
    private casaService: CasaService) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {

      const casa = this.casaService.getCasaFromId(params.id);

      this.getParlamentarById(params.id);
      this.getProposicoesVotacoes(casa);
    });
  }

  pageChange(p: number) {
    this.p = p;
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getVotosbyId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
        },
        error => {
          console.log(error);
        }
      );
  }

  getProposicoesVotacoes(casa: string) {
    this.proposicaoService.getProposicoesVotacoes(casa)
    .pipe(takeUntil(this.unsubscribe)).subscribe(proposicoes => {
      this.proposicoes = proposicoes;
    },
      error => console.log(error)
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
