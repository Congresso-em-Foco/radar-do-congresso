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

  constructor(private assiduidadeService: AssiduidadeService) { }

  ngOnInit() {
    this.ano = '2020';
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
    this.getAssiduidade(this.ano);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
