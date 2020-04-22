import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, forkJoin } from 'rxjs';
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
  readonly PRESIDENTE = 4;
  readonly LIBEROU = 5;

  private unsubscribe = new Subject();

  public proposicoes: Proposicao[];
  public proposicaoSelecionada: Proposicao;
  public votacoes: any[];
  public votacoesFiltradas: any[];
  public votacaoSelecionada: any;
  public votacaoSelecionadaVotos: any;
  public ordenacao: string;

  p = 1;

  constructor(private proposicaoService: ProposicaoService) { }

  ngOnInit() {
    this.ordenacao = 'parlamentar';
    this.getVotosImportantes();
  }

  getVotosImportantes() {
    forkJoin(
      this.proposicaoService.getProposicoesImportantes(),
      this.proposicaoService.getVotosImportantes()
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.proposicoes = data[0];
        this.proposicaoSelecionada = this.proposicoes[0];
        this.votacoes = data[1];
        this.votacaoSelecionada = this.proposicaoSelecionada.proposicaoVotacoes[0];
        this.votacaoSelecionadaVotos = this.getVotosByVotacao(this.proposicaoSelecionada.proposicaoVotacoes[0]);
        this.ordenar();
      },
        error => {
          console.log(error);
        });
  }

  onChangeProposicao() {
    this.votacaoSelecionada = this.proposicaoSelecionada.proposicaoVotacoes[0];
    this.votacaoSelecionadaVotos = this.getVotosByVotacao(this.proposicaoSelecionada.proposicaoVotacoes[0]);
    this.onChangeVotacao();
  }

  onChangeVotacao() {
    this.p = 1;
    this.votacaoSelecionadaVotos = this.getVotosByVotacao(this.votacaoSelecionada);
    this.ordenar();
  }

  getVotosByVotacao(votacao: any) {
    return this.votacoes.find(item => item.idVotacao === votacao.idVotacao);
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
        case this.PRESIDENTE:
          textoVoto = 'PRESIDENTE';
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

  ordenar() {
    this.p = 1;
    if (this.ordenacao === 'parlamentar') {
      this.votacaoSelecionadaVotos.votacoesVoto.sort((a, b) => {
        return (a.votoParlamentar.nomeEleitoral > b.votoParlamentar.nomeEleitoral) ? 1 : -1;
      });
    } else if (this.ordenacao === 'partido') {
      this.votacaoSelecionadaVotos.votacoesVoto.sort((a, b) => {
        return (a.votoParlamentar.parlamentarPartido.sigla > b.votoParlamentar.parlamentarPartido.sigla) ? 1 : -1;
      });
    } else if (this.ordenacao === 'uf') {
      this.votacaoSelecionadaVotos.votacoesVoto.sort((a, b) => {
        return (a.votoParlamentar.uf > b.votoParlamentar.uf) ? 1 : -1;
      });
    } else if (this.ordenacao === 'voto') {
      this.votacaoSelecionadaVotos.votacoesVoto.sort((a, b) => {
        return b.voto - a.voto;
      });
    }
  }

  pageChange(p: number) {
    this.p = p;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
