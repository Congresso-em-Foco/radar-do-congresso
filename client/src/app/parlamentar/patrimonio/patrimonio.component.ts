import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ParlamentarPatrimonio } from 'src/app/shared/models/parlamentarPatrimonio.model';

@Component({
  selector: 'app-patrimonio',
  templateUrl: './patrimonio.component.html',
  styleUrls: ['./patrimonio.component.scss']
})
export class PatrimonioComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  patrimonio: ParlamentarPatrimonio[];

  p = 1;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getPatrimonioById(params.id);
    });
  }

  pageChange(p: number) {
    this.p = p;
  }

  getPatrimonioById(id: string) {
    this.parlamentarService
      .getPatrimonioById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        patrimonio => {
          this.patrimonio = patrimonio;
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
