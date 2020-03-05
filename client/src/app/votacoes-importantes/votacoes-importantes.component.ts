import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProposicaoService } from '../shared/services/proposicao.service';
import { Proposicao } from '../shared/models/proposicao.model';

@Component({
  selector: 'app-votacoes-importantes',
  templateUrl: './votacoes-importantes.component.html',
  styleUrls: ['./votacoes-importantes.component.scss']
})
export class VotacoesImportantesComponent implements OnInit, OnDestroy {

  readonly SIM = 1;
  readonly NAO = -1;
  readonly FALTOU = 0;
  readonly OBSTRUCAO = 2;
  readonly ABSTENCAO = 3;
  readonly LIBEROU = 5;

  private unsubscribe = new Subject();

  public proposicoes: Proposicao[];
  public proposicaoSelecionada: Proposicao;

  p = 1;

  constructor(private proposicaoService: ProposicaoService) { }

  ngOnInit() {
    this.getImportantes();
  }

  getImportantes() {
    this.proposicaoService
      .getProposicoesImportantes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(proposicoes => {
        this.proposicoes = proposicoes;
        this.proposicaoSelecionada = this.proposicoes[0];
      },
      error => {
        console.log(error);
      });
  }

  selecionarProposicao(proposicao: Proposicao) {
    this.proposicaoSelecionada = proposicao;
  }

  getTextoVoto(voto: number, votoSecreto: boolean): string {
    let textoVoto: string;
    if (votoSecreto) {
      textoVoto = 'VOTO SECRETO';
    } else {
      switch (voto) {
        case this.SIM:
          textoVoto = 'SIM';
          break;
        case this.NAO:
          textoVoto = 'NÃO';
          break;
        case this.FALTOU:
          textoVoto = 'FALTOU';
          break;
        case this.OBSTRUCAO:
          textoVoto = 'OBSTRUÇÃO';
          break;
        case this.LIBEROU:
          textoVoto = 'LIBEROU';
          break;
        case this.ABSTENCAO:
          textoVoto = 'ABSTENÇÃO';
          break;
        case undefined:
          textoVoto = '--';
          break;
        default:
          break;
      }
    }
    return textoVoto;
  }

  pageChange(p: number) {
    this.p = p;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
