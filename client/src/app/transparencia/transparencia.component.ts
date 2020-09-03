import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TransparenciaService } from '../shared/services/transparencia.service';

import { ParlamentarAderencia } from '../shared/models/parlamentarAderencia.model';
import { BuscaParlamentarService } from '../shared/services/busca-parlamentar.service';

import { UpdateService } from '../shared/services/update.service';

@Component({
  selector: 'app-transparencia',
  templateUrl: './transparencia.component.html',
  styleUrls: ['./transparencia.component.scss']
})
export class TransparenciaComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public transparencias: any = {};
  casa: string;
  
  parlamentaresCasa: ParlamentarAderencia[];
  gruposPorEstrelas: object = {};
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private updateService: UpdateService,
    private transparenciaService: TransparenciaService,
    private buscaParlamentarServive: BuscaParlamentarService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.casa = params.get('casa');
        this.getTransparencia(params.get('casa'));
        this.getParlamentares(params.get('casa'));
      });
  }
  getTransparencia(casa: string) {
    this.transparenciaService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          let list = data.split("\r\n");
          list.forEach( e => { 
            let c = e.split(";");
            if(c[1] && c[1]==casa) this.transparencias[c[0]] = {id:c[0], casa:c[1], estrelas:c[2]};
          });
        },
        error => {
          console.log(error);
        }
      );
  }
  getParlamentares(casa: string) {
    this.buscaParlamentarServive
      .getParlamentares()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentares => {
          this.gruposPorEstrelas = {};
          this.parlamentaresCasa = parlamentares.filter(p => {
            return (p.casa === casa);
          }).map(p=>{
            p.transparencia = this.transparencias[p.idParlamentarVoz];
            if(!p.transparencia) p.transparencia = {id:p.idParlamentarVoz, casa:casa, estrelas:"0"};
            if(!this.gruposPorEstrelas[p.transparencia.estrelas]) this.gruposPorEstrelas[p.transparencia.estrelas] = [];
            this.gruposPorEstrelas[p.transparencia.estrelas].push(p);
            return p;
          });
        },
        error => console.log(error)
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
