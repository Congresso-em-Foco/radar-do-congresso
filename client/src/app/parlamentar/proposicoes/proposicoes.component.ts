import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { ParlamentarProposicoes } from '../../shared/models/parlamentarProposicoes.model'

@Component({
  selector: 'app-proposicoes',
  templateUrl: './proposicoes.component.html',
  styleUrls: ['./proposicoes.component.scss']
})
export class ProposicoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentarProposicoes: ParlamentarProposicoes;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarProposicoesById(params.id)      
    });
  }

  getParlamentarProposicoesById(id: string) {
    this.parlamentarService
      .getProposicoesParlamentarbyId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        proposicoes => {
          this.parlamentarProposicoes = proposicoes;
          console.log(proposicoes);
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
