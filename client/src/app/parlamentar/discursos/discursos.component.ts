import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { Discurso } from '../../shared/models/discurso.model';

@Component({
  selector: 'app-discursos',
  templateUrl: './discursos.component.html',
  styleUrls: ['./discursos.component.scss']
})
export class DiscursosComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentarDiscursos: Discurso[];

  p = 1;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarDiscursosById(params.id);
    });
  }

  pageChange(p: number) {
    this.p = p;
  }

  getParlamentarDiscursosById(id: string) {
    this.parlamentarService
      .getDiscursosParlamentarById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        discursos => {
          this.parlamentarDiscursos = discursos.parlamentarDiscursos;
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
