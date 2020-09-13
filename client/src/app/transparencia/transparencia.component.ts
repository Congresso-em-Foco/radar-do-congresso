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
    private buscaParlamentarService: BuscaParlamentarService,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.casa = params.get('casa');
        this.getTransparencia(this.casa);
        this.getMyParlamentares(this.casa);
      });
  }
  getTransparencia(casa: string) {
    this.transparenciaService
      .get(casa)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          data.forEach(
            t => {
              this.transparencias[t.id_parlamentar_voz] = t;
            }    
          );
        },
        error => {
          console.log(error);
        }
      );
  }
  getMyParlamentares(casa: string) {
    this.gruposPorEstrelas = {};
    this.buscaParlamentarService
      .getParlamentarestodos().forEach(
        parlamentares => {
          this.parlamentaresCasa = parlamentares.filter(p => {
            return (p.casa === casa);
          }).map(p=>{
            let ptransparencia = this.transparencias[p.idParlamentarVoz];
            if(!ptransparencia) ptransparencia = {id_parlamentar_voz:p.idParlamentarVoz, casa:casa, estrelas:"0"};
            if(!this.gruposPorEstrelas[ptransparencia.estrelas]) this.gruposPorEstrelas[ptransparencia.estrelas] = [];
            this.gruposPorEstrelas[ptransparencia.estrelas].push(p);
            return p;
          });
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
