import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AssiduidadeService } from '../shared/services/assiduidade.service';
import { Assiduidade } from '../shared/models/assiduidade.model';

@Component({
  selector: 'app-assiduidade',
  templateUrl: './assiduidade.component.html',
  styleUrls: ['./assiduidade.component.scss']
})
export class AssiduidadeComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public assiduidade: Assiduidade;
  public ano: string;
  public p = 1;
  public ordenacao: string;
  
  constructor(private assiduidadeService: AssiduidadeService) { }

  ngOnInit() {
    this.ano = '2021';
    this.ordenacao = 'assiduidade';
    this.getAssiduidade(this.ano);
  }

  getAssiduidade(ano: string) {
    this.assiduidadeService
      .get('camara', ano)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        assiduidade => {
          this.assiduidade = assiduidade[0];
        },
        error => {
          console.log(error);
        }
      );
  }

  setAno(ano: string) {
    this.ano = ano;
    this.pageChange(1);
    this.getAssiduidade(this.ano);
  }

  ordenar() {
    if (this.ordenacao === 'assiduidade') {
      this.assiduidade.parlamentares.sort((a, b) => {
        if (b.totalPresenca - a.totalPresenca === 0) {
          return (a.assiduidadeParlamentar.nomeEleitoral > b.assiduidadeParlamentar.nomeEleitoral) ? 1 : -1;
        } else {
          return b.totalPresenca - a.totalPresenca;
        }
      });
    } else if (this.ordenacao === 'alfabetica') {
      this.assiduidade.parlamentares.sort((a, b) => {
        return (a.assiduidadeParlamentar.nomeEleitoral > b.assiduidadeParlamentar.nomeEleitoral) ? 1 : -1;
      });
    } else if (this.ordenacao === 'uf') {
      this.assiduidade.parlamentares.sort((a, b) => {
        return (a.assiduidadeParlamentar.uf > b.assiduidadeParlamentar.uf) ? 1 : -1;
      });
    } else if (this.ordenacao === 'partido') {
      this.assiduidade.parlamentares.sort((a, b) => {
        return (a.assiduidadeParlamentar.parlamentarPartido.sigla > b.assiduidadeParlamentar.parlamentarPartido.sigla) ? 1 : -1;
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
