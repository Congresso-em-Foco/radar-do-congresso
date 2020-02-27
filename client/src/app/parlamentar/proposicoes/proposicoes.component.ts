import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { ProposicaoInfo } from '../../shared/models/proposicaoInfo.model';

@Component({
  selector: 'app-proposicoes',
  templateUrl: './proposicoes.component.html',
  styleUrls: ['./proposicoes.component.scss']
})
export class ProposicoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  proposicoesAutoradas: ProposicaoInfo[];

  p = 1;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarProposicoesById(params.id);
    });
    this.cdr.detectChanges();
  }

  pageChange(p: number) {
    this.p = p;
  }

  getParlamentarProposicoesById(id: string) {
    this.parlamentarService
      .getProposicoesParlamentarbyId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        proposicoes => {
          this.proposicoesAutoradas = proposicoes.proposicaoAutores;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
