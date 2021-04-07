import { Pipe, PipeTransform, Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ParlamentarInfo } from 'src/app/shared/models/parlamentarInfo.model';
import { ParlamentarAssiduidade, AssiduidadeParlamentar } from 'src/app/shared/models/assiduidade.model';

import { TransparenciaService } from 'src/app/shared/services/transparencia.service';
import { InqueritosService } from 'src/app/shared/services/inqueritos.service';
import { GovernismoService } from 'src/app/shared/services/governismo.service';


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
  parlamentarGovernismo: any;
  parlamentarGovernismoDatas: any;

  parlamentarTransparencia: number = 0;
  parlamentarInvestigacoes: any[] = [];

  public dataAtualizacao: string = myGlobals.dataAtualizacao;
  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private transparenciaService: TransparenciaService,
    private inqueritosService: InqueritosService,
    private governismoService: GovernismoService
  ){}

  ngOnInit() {
  	this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
      this.getParlamentarAssiduidadeById(params.id);
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
          this.getTransparencia(parlamentar.casa, parlamentar.idParlamentarVoz);
          this.getGovernismo(parlamentar.idParlamentarVoz);
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
  
  getGovernismo(id: string) {
    this.governismoService
      .getById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          data.color = this.scalecolor(data.total);
          this.parlamentarGovernismo = data;
          let datas = [];
          if(data.trimestral)Object.entries(data.trimestral).forEach((d,i)=>{
            let date = new Date(d[0]);
            if(!datas[date.getFullYear()]) datas[date.getFullYear()] = {ano: date.getFullYear(), meses:[]};
            datas[date.getFullYear()].meses.push(d[1]["total"]);
          });
          this.parlamentarGovernismoDatas = Object.values(datas);
        },
        error => {
          console.log(error);
        }
      );
  }
  getTransparencia(casa: string,id: string) {
    this.transparenciaService
      .get(casa)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        data => {
          data.forEach(
            t => {
              if(t && t.id_parlamentar_voz==id) this.parlamentarTransparencia = t.estrelas;
            }    
          );
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
          let list = data.replace(/\r/g, "").split(/\n/);
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
  scalecolor(v: number){
    if(v>75){
      return "#8e3e90";
    }else if(v>50){
      return "#e46873";
    }else if(v>25){
      return "#f7b871";
    }else{
      return "#efe38a";
    }
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
