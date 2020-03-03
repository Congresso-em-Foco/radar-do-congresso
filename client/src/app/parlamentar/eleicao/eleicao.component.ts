import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ParlamentarEleicao } from 'src/app/shared/models/parlamentarEleicao.model';

@Component({
  selector: 'app-eleicao',
  templateUrl: './eleicao.component.html',
  styleUrls: ['./eleicao.component.scss']
})
export class EleicaoComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public eleicao: ParlamentarEleicao;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getVotosEleicaoById(params.id);
    });
  }

  getVotosEleicaoById(id: string) {
    this.parlamentarService
      .getVotosEleicaoByid(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        eleicao => {
          this.eleicao = eleicao;
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
