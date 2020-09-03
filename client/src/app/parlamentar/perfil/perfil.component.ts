import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ParlamentarInfo } from 'src/app/shared/models/parlamentarInfo.model';
import { ParlamentarAssiduidade, AssiduidadeParlamentar } from 'src/app/shared/models/assiduidade.model';

import { TransparenciaService } from 'src/app/shared/services/transparencia.service';
import { InqueritosService } from 'src/app/shared/services/inqueritos.service';


import * as myGlobals from 'src/app/globals';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  parlamentar: ParlamentarInfo;

  parlamentarAssiduidade: number;
  parlamentarGovernismo: number = 0;
  parlamentarGovernismoDatas: object = [
    {ano:2019, meses:[80,95,90,50]},
    {ano:2020, meses:[80,95,90,50,45,30,20]},
  ];

  parlamentarTransparencia: number = 0;
  parlamentarInvestigacoes: any[] = [];

  public dataAtualizacao: string = myGlobals.dataAtualizacao;
  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private transparenciaService: TransparenciaService,
    private inqueritosService: InqueritosService
  ){}

  ngOnInit() {
  	this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
      this.getParlamentarAssiduidadeById(params.id);
      this.getTransparencia(params.id);
      this.getInqueritos(params.id);
    });
  }
  getParlamentarById(id: string) {
	  this.parlamentarService
	    .getInfoById(id)
	    .pipe(takeUntil(this.unsubscribe))
	    .subscribe(
	      parlamentar => {
	        this.parlamentar = parlamentar;
	      },
	      error => {
	        console.log(error);
	      }
	    );
	}
  getParlamentarAssiduidadeById(id: string) {
    this.parlamentarService.getAssiduidadeByid(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentarAssiduidade => {
          let t = 0,
              p = 0;
          for (var i = 0; i < parlamentarAssiduidade.parlamentarAssiduidade.length; i++) {
            var a = parlamentarAssiduidade.parlamentarAssiduidade[i];
            t+=parseInt(a.totalSessoesDeliberativas);            
            p+=parseInt(a.totalPresenca);            
          }
          this.parlamentarAssiduidade = t ? Math.round(p/t*100) : null;
        },
        error => {
          console.log(error);
        }
      );
  }
  getTransparencia(id: string) {
    this.transparenciaService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          let list = data.split("\r\n");
          list.forEach( e => { 
            let c = e.split(";");
            if(c[0] && c[0]==id) this.parlamentarTransparencia = parseInt(c[2]);
          });
        },
        error => {
          console.log(error);
        }
      );
  }
  getInqueritos(id: string) {
    this.inqueritosService
      .get()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          let list = data.split("\r\n");
          list.forEach( e => { 
            let c = e.split("\t");
            if(c[0] && c[0]==id){
              this.parlamentarInvestigacoes.push( {numero: c[1], onde: c[2], infos: c[3], defesa: c[4]} );
            }
          });
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
