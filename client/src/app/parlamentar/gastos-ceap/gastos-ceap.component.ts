import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { GastosCeap } from 'src/app/shared/models/parlamentarGastosCeap.model';


@Component({
  selector: 'app-gastos-ceap',
  templateUrl: './gastos-ceap.component.html',
  styleUrls: ['./gastos-ceap.component.scss']
})
export class GastosCeapComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  gastosCeap: GastosCeap [];
  gastosCeapAgregados: any[];

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.gastosCeapAgregados = [];
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarGastosCeapById(params.id);
    });
  }

  getParlamentarGastosCeapById(id: string) {
    this.parlamentarService.getGastosCeapByid(id)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      parlamentarGastosCeap => {
        this.gastosCeap = parlamentarGastosCeap.parlamentarGastosCeap;
        this.agregaGastorPorCategoria(this.gastosCeap);
      },
      error => {
        console.log(error);
      }
    );

  }
  agregaGastorPorCategoria(gastosCeap: GastosCeap[]) {
    let arr = [];

    gastosCeap.reduce((rv, x) => {
        if(!rv[x.categoria]) {
          rv[x.categoria] = {"categoria": x.categoria, "valor_gasto": 0};
          arr.push(rv[x.categoria]);
        } 
        rv[x.categoria].valor_gasto = rv[x.categoria].valor_gasto + x.valor_gasto;
        return rv;
      }, {});
    
    arr.map(x => this.gastosCeapAgregados.push([x.categoria, x.valor_gasto]));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
