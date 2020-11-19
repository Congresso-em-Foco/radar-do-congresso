import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { 
  ActivatedRoute, 
  Params,
  Router
} from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GovernismoService } from '../shared/services/governismo.service';

import { ParlamentarAderencia } from '../shared/models/parlamentarAderencia.model';
import { BuscaParlamentarService } from '../shared/services/busca-parlamentar.service';
import { ParlamentarService } from '../shared/services/parlamentar.service';

import { UpdateService } from '../shared/services/update.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-governismo',
  templateUrl: './governismo.component.html',
  styleUrls: ['./governismo.component.scss']
})
export class GovernismoComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public casa: string;

  public parlamentaresCasa = {};

  public gTemp: any;
  public gGeral: any;
  public gTrimestral: any;
  public gParlamentares: any;
  public gGrupos: any;
  public cDate: any;
  public svg: any;
  public np: number;
  public parlamentaresInfos: any;

  public innerWidth: any;
  public innerHeight: any;
  showLoader: boolean = true;

  public loc: any;

  public partidos: any;
  public ufs: any;

  public partidoFilter: string;
  public ufFilter: string;
  public generoFilter: string;
  public nomeFilter: string;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private updateService: UpdateService,
    private governismoService: GovernismoService,
    private buscaParlamentarService: BuscaParlamentarService,
    private parlamentarService: ParlamentarService
  ) { }

  ngOnInit(){
    this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.cDate = new Date();
      this.casa = params.get('casa');
      this.gTemp= {};

      this.partidos = [];
      this.ufs = [];

      this.partidoFilter = "";
      this.ufFilter = "";
      this.generoFilter = "";
      this.nomeFilter = "";
      
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.svg = d3.select("#radarControler");
      this.svg.node().parentNode.classList.add('carregando');
      
      this.getInfosSimplificadas();
      this.showLoader = false;
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
  ngAfterViewInit(){
  }
  getGovernismo(){
    this.governismoService
    .get(this.casa)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      data => {
        this.gTemp = data;

        let parls = Object.values(this.gTemp.parlamentares);
        for (let i = 0; i < parls.length; i++) {
          if(this.parlamentaresInfos[parls[i]["id"]]){
            parls[i]["infos"] = this.parlamentaresInfos[parls[i]["id"]];
          }
        }
        this.montaTela();
      },
      error => {
        console.log(error);
      }
    );
  }
  getInfosSimplificadas() {
    this.parlamentarService
    .getSimplificado(this.casa)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      data => {
        this.parlamentaresInfos = data;
        this.partidos = Object.values(this.parlamentaresInfos).map((w: any)=>w.partido).sort().filter(function(el,j,a){return j===a.indexOf(el)});
        this.ufs = Object.values(this.parlamentaresInfos).map((w: any)=>w.uf).sort().filter(function(el,j,a){return j===a.indexOf(el)});
        this.getGovernismo();
      },
      error => {
        console.log(error);
      }
    );
  }
  montaTela(){
    this.gGeral= {n:0,afavor:0,total:0,nvotacoes:0};
    this.gParlamentares= this.gTemp.parlamentares;
    this.gGrupos= {0:[],25:[],50:[],75:[]};
    this.gTrimestral = [];
    let parls = Object.values(this.gParlamentares);

    this.svg.selectAll("*").remove();
    let gT = {};
    let count = 0;
    for (let i = 0; i < parls.length; i++) {
      let p = parls[i];
      if(p["infos"]){
        if(this.partidoFilter!="" && p["infos"]["partido"] != this.partidoFilter) continue;
        if(this.ufFilter!="" && p["infos"]["uf"] != this.ufFilter) continue;
        if(this.generoFilter!="" && p["infos"]["genero"] != this.generoFilter) continue;
        if(this.nomeFilter!="" && p["infos"]["nome"] != this.nomeFilter) continue;
        if(p["n"]){
          if(p["total"]>75){
            this.gGrupos[75].push(p);
          }else if(p["total"]>50){
            this.gGrupos[50].push(p);
          }else if(p["total"]>25){
            this.gGrupos[25].push(p);
          }else{
            this.gGrupos[0].push(p);
          }
          
          count++;
          this.gGeral.n += p["n"];
          this.gGeral.afavor += p["afavor"];
          
          for (let j = 0; j < Object.entries(p["trimestral"]).length; j++) {
            let t = Object.entries(p["trimestral"])[j];
            if(!gT[t[0]]) gT[t[0]] = {
              data:t[0],
              date: new Date(t[0]),
              0:0,25:0,50:0,75:0,np:0,
              nvotacoes:this.gTemp.trimestral[t[0]].nvotacoes,
              afavor:0, n:0
            };
            if(t[1]["n"]){
              if(t[1]["total"]>75){
                gT[t[0]][75]++;
              }else if(t[1]["total"]>50){
                gT[t[0]][50]++;
              }else if(t[1]["total"]>25){
                gT[t[0]][25]++;
              }else{
                gT[t[0]][0]++;
              }
              gT[t[0]]['np']++;
              gT[t[0]]['n'] += t[1]["n"];
              gT[t[0]]['afavor'] += t[1]["afavor"];
            }
          }

        }
      }
    }
    this.gGeral.total = Math.round(this.gGeral.afavor/this.gGeral.n*100);
    
    this.np = count;
    let ultimo = {0:0,25:0,50:0,75:0,np:0,nvotacoes:0,afavor:0,n:0};
    this.gTrimestral = Object.values(gT);
    this.gTrimestral = this.gTrimestral.sort((a,b)=>{
      return a["date"] - b["date"];
    }).map(w=>{
      w[0] += ultimo[0];
      w[25] += ultimo[25];
      w[50] += ultimo[50];
      w[75] += ultimo[75];
      w["np"] += ultimo["np"];
      w["nvotacoes"] += ultimo["nvotacoes"];
      w["n"] += ultimo["n"];
      w["afavor"] += ultimo["afavor"];

      ultimo[0] = w[0];
      ultimo[25] = w[25];
      ultimo[50] = w[50];
      ultimo[75] = w[75];
      ultimo["np"] = w["np"];
      ultimo["nvotacoes"] = w["nvotacoes"];
      ultimo["n"] = w["n"];
      ultimo["afavor"] = w["afavor"];

      this.gGeral.nvotacoes = ultimo["nvotacoes"];

      return w;
    });
    this.drawChart();
  }
  partidoChanged(v){
    this.partidoFilter = v;
    this.montaTela();
  }
  ufChanged(v){
    this.ufFilter = v;
    this.montaTela();
  }
  generoChanged(v){
    this.generoFilter = v;
    this.montaTela();
  }
  nomeChanged(v){
    this.nomeFilter = v;
    this.montaTela();
  }
  limpaFiltros(v){
    if(!v){
      this.partidoFilter = "";
      this.ufFilter = "";
      this.generoFilter = "";
      this.nomeFilter = "";
      this.montaTela();
      document.querySelectorAll('.filtro select').forEach(function(v){
        (<HTMLInputElement>v).value = "";
      });
    }
  }

  public linkPerfil(n) {
    this.router.navigate(['/parlamentar/'+n.id]);
  }
  private drawChart(): void {
      let pw = this.innerWidth,
          ph = this.innerHeight*.75 - 80;

      this.svg.attr('viewbox','0 0 '+pw+' '+ph).attr('width',pw).attr('height',ph+20);
              this.svg.selectAll("*").remove();
      this.svg.node().parentNode.classList.remove('carregando');

      let g = this.svg.append('g').attr('transform','translate('+(pw/2)+',0)');
      let estrutura = g.append('g');
      let bolas1 = g.append('g');
      let bolas2 = g.append('g');
      let bolas3 = g.append('g');
      let bolas4 = g.append('g');

      let z1 = .45,
          z2 = .62,
          z3 = .80;

      estrutura.append('circle').attr('r',67).attr('fill','none');
      estrutura.append('circle').attr('r',ph*z1).attr('fill','none').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('circle').attr('r',ph*z2).attr('fill','none').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('circle').attr('r',ph*z3).attr('fill','none').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('circle').attr('r',ph).attr('fill','none').attr('stroke','#ccc').attr('stroke-width',1);

      estrutura.append('rect').attr("x",-20).attr("width",40).attr("height",15).attr("rx",8).attr('y',-8+ph*z1).attr('fill','#fff').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('rect').attr("x",-20).attr("width",40).attr("height",15).attr("rx",8).attr('y',-8+ph*z2).attr('fill','#fff').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('rect').attr("x",-20).attr("width",40).attr("height",15).attr("rx",8).attr('y',-8+ph*z3).attr('fill','#fff').attr('stroke','#ccc').attr('stroke-width',1);
      estrutura.append('rect').attr("x",-20).attr("width",40).attr("height",15).attr("rx",8).attr('y',-8+ph).attr('fill','#fff').attr('stroke','#ccc').attr('stroke-width',1);

      estrutura.append('text')
        .attr("alignment-baseline","middle").attr("text-anchor","middle").attr("fill","#888").attr("font-family","Roboto Mono").attr("font-size","11px")
        .attr('y',ph*z1).text("75%");
      estrutura.append('text')
        .attr("alignment-baseline","middle").attr("text-anchor","middle").attr("fill","#888").attr("font-family","Roboto Mono").attr("font-size","11px")
        .attr('y',ph*z2).text("50%");
      estrutura.append('text')
        .attr("alignment-baseline","middle").attr("text-anchor","middle").attr("fill","#888").attr("font-family","Roboto Mono").attr("font-size","11px")
        .attr('y',ph*z3).text("25%");
      estrutura.append('text')
        .attr("alignment-baseline","middle").attr("text-anchor","middle").attr("fill","#888").attr("font-family","Roboto Mono").attr("font-size","11px")
        .attr('y',ph).text("0%");


      let scalecolor = (f)=>{
        let v = f.total;
        if(f.rep){
          return "none";
        }else{
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
      }
      let scalesize = f=>{
        let v = f.total;
        if(f.rep){
          if(v>75){
            return 95;
          }else if(v>50){
            return ph*z1+15;
          }else if(v>25){
            return ph*z2+15;
          }else{
            return ph*z3+15;
          }
        }else{
          if(!f.infos.presenca) return 6;
          let z = Math.round(f.infos.presenca/f.infos.sessoes*100);
          if(z>70){
            return 6;
          }else if(z>30){
            return 4;
          }else{
            return 1;
          }
        }
      }
      let forcey = (f)=>{
        let v = f.total;
        if(f.rep){
          return 0;
        }else{
          if(v>75){
            return 105;
          }else if(v>50){
            return ph*z1+15;
          }else if(v>25){
            return ph*z2+15;
          }else{
            return ph*z3+15;
          }
        }
      }

      let fx = 0.1,
          fy = 0.4,
          fc = 0.999,
          decay = .85,
          alphaTarget = .01;
    
      var dd1 = [{rep:1,total:76}].concat(this.gGrupos[75]);
      var b1 = bolas1.selectAll('circle').data(dd1).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>forcey(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s1 = d3.forceSimulation().nodes(dd1)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b1.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd2 = [{rep:1,total:51}].concat(this.gGrupos[50]);
      var b2 = bolas2.selectAll('circle').data(dd2).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>forcey(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s2 = d3.forceSimulation().nodes(dd2)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b2.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd3 = [{rep:1,total:26}].concat(this.gGrupos[25]);
      var b3 = bolas3.selectAll('circle').data(dd3).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>forcey(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s3 = d3.forceSimulation().nodes(dd3)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b3.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd4 = [{rep:1,total:2}].concat(this.gGrupos[0]);
      var b4 = bolas4.selectAll('circle').data(dd4).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>forcey(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s4 = d3.forceSimulation().nodes(dd4)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b4.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      function positionTooltip(e){
        let tt = document.getElementById('tooltip');
        var x = e.clientX,
          y = e.clientY,
          top = y+30,
          left = Math.max((177),Math.min(window.innerWidth-(177),x));
        
        tt.style.left = left+"px";
        tt.style.top = top+"px";
      }
      function toolTip(n,e){
        let tooltip = d3.select("#tooltip");
        positionTooltip(e);
        let o='<div class="governismo" style="background:'+scalecolor(n)+'; color:'+(scalecolor(n)=='#efe38a'?'#000':'#fff')+';">';
          o+='<img width="100%" class="parlementar-img img-filter" src="'+n.infos.foto+'">';
          o+='<div><h2>'+n.infos.nome+' <span>'+n.infos.partido+'/'+n.infos.uf+'</span></h2><p class="mb-4">No governo Bolsonaro</p>';
          o+='<div class="t">Governismo</div><div class="n">'+n.total+'%</div><div class="graficobarra"><div class="estrutura">';

          let ano = 0;
          if(n.trimestral)Object.entries(n.trimestral).forEach((d,i)=>{
            let date = new Date(d[0]);
            
            if(date.getFullYear() != ano){
              if(ano > 0) o+= '</div>';
              ano = date.getFullYear();
              o+='<div class="ano">';
              o+='<span>'+date.getFullYear()+'</span>';
            }
            o+='<div class="mes" style="height:'+d[1]["total"]+'%;"></div>'; 
          });
          if(n.trimestral)o+= '</div>';
              
        o+='</div></div>';
        if(n.infos.presenca)o+='<div class="t o mt-2">Presença em votações</div><div class="n o">'+Math.round(n.infos.presenca/n.infos.sessoes*100)+'%</div>';
        o+='</div></div>';
        tooltip.html(o);
        tooltip.style("background",scalecolor(n));
        tooltip.style("color",(scalecolor(n)=='#efe38a'?'#000':'#fff'));

        tooltip.attr("class","ativo");
      }
      function fechaToolTip(n){
        let tooltip = d3.select("#tooltip");
        tooltip.attr("class","");
      }
  }
  
}
