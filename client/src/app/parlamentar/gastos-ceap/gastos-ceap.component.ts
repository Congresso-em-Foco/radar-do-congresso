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

  gastosCeap: GastosCeap[];
  gastosCeapAgregados: any[];
  chartData: any[];
  gastoSelecionado: any[];
  despesasEspecificas: GastosCeap[];
  
  public p = 1;
  public ordenacao: string;

  constructor(
    private parlamentarService: ParlamentarService,
    private activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.gastosCeapAgregados = [];
    this.gastoSelecionado = [];
    this.despesasEspecificas = [];
    this.ordenacao = 'despesa';
    this.setChartdata([]);
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarGastosCeapById(params.id);
    });
  }

  setChartdata(newData) {
    this.chartData = newData;
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
    const arr = [];

    gastosCeap.reduce((rv, x) => {
      if (!rv[x.categoria]) {
        rv[x.categoria] = { categoria: x.categoria, valor_gasto: 0 };
        arr.push(rv[x.categoria]);
      }
      rv[x.categoria].valor_gasto = rv[x.categoria].valor_gasto + x.valor_gasto;
      return rv;
    }, {});

    arr.map(x => this.gastosCeapAgregados.push([x.categoria, x.valor_gasto]));
    this.setChartdata(this.gastosCeapAgregados);
  }

  onSelect(selection: any) {
    if(selection !== undefined && selection.length > 0) {
      const indice = selection[0].row
      if (indice !== undefined) {
        this.gastoSelecionado = this.gastosCeapAgregados[indice];
        this.despesasEspecificas = this.gastosCeap.filter(e => e.categoria === this.gastoSelecionado[0]);
        this.ordenar();
      }      
    }
  }

  ordenar() {
    if (this.ordenacao === 'despesa') {
      this.despesasEspecificas.sort((a, b) => {
        return (a.especificacao > b.especificacao) ? 1 : -1;
      });
    } else if (this.ordenacao === 'data') {
      this.despesasEspecificas.sort((a, b) => {
        return (a.dataEmissao > b.dataEmissao) ? 1 : -1;
      });
    } else if (this.ordenacao === 'fornecedor') {
      this.despesasEspecificas.sort((a, b) => {
        return (a.fornecedor > b.fornecedor) ? 1 : -1;
      });
    } else if (this.ordenacao === 'valor') {
      this.despesasEspecificas.sort((a, b) => {
        return (a.valor_gasto > b.valor_gasto) ? 1 : -1;
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
