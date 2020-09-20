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
      this.cDate = new Date(2019,0,0);
      this.casa = params.get('casa');
      this.gGeral= {};
      this.gParlamentares= {};
      this.gGrupos= {0:[],25:[],50:[],75:[]};
      this.innerWidth = window.innerWidth;
      this.innerHeight = window.innerHeight;
      this.getInfosSimplificadas();
      this.svg = d3.select("#radarControler");
      this.svg.node().parentNode.classList.add('carregando');
      this.svg.selectAll("*").remove();
      this.getGovernismo();
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
        this.gGeral= data;
        this.gParlamentares= data.parlamentares;
        
        let x = Object.values(this.gParlamentares).length;
        let gT = {};
        let count = 0;
        Object.values(this.gParlamentares).forEach(p=>{
          x--;
          if(this.parlamentaresInfos[p["id"]]){
            p["infos"] = this.parlamentaresInfos[p["id"]]; 
            if(p["n"]){
              count++;
              if(p["total"]>75){
                this.gGrupos[75].push(p);
              }else if(p["total"]>50){
                this.gGrupos[50].push(p);
              }else if(p["total"]>25){
                this.gGrupos[25].push(p);
              }else{
                this.gGrupos[0].push(p);
              }
            }
          }
          Object.entries(p["trimestral"]).forEach(t=>{
            if(!gT[t[0]]) gT[t[0]] = {data:t[0],0:0,25:0,50:0,75:0,np:0};
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
            }else{
              console.log(t[1]);
            }
          });
          if(x<=0){
            this.drawChart();
            this.np = count;
            let ultimo = {0:0,25:0,50:0,75:0,np:0};
            this.gTrimestral = Object.values(gT).map(w=>{
              w[0] += ultimo[0];
              w[25] += ultimo[25];
              w[50] += ultimo[50];
              w[75] += ultimo[75];
              w["np"] += ultimo["np"];

              ultimo[0] = w[0];
              ultimo[25] = w[25];
              ultimo[50] = w[50];
              ultimo[75] = w[75];
              ultimo["np"] = w["np"];
              
              return w;
            });
          }
        });

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
      },
      error => {
        console.log(error);
      }
    );
  }

  public linkPerfil(n) {
    this.router.navigate(['/parlamentar/'+n.id]);
  }

  private drawChart(): void {
      let pw = this.innerWidth,
          ph = this.innerHeight*.60 - 80;

      this.svg.attr('viewbox','0 0 '+pw+' '+ph).attr('width',pw).attr('height',ph+20);
              this.svg.selectAll("*").remove();
      this.svg.node().parentNode.classList.remove('carregando');

      let g = this.svg.append('g').attr('transform','translate('+(pw/2)+',0)');
      let estrutura = g.append('g');
      let bolas1 = g.append('g');
      let bolas2 = g.append('g');
      let bolas3 = g.append('g');
      let bolas4 = g.append('g');

      let z1 = .35,
          z2 = .56,
          z3 = .77;

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


      let scaley = (f)=>{
        let v = f.total;
        if(v>75){
          return ph*.2;
        }else if(v>50){
          return ph*.45;
        }else if(v>25){
          return ph*.66;
        }else{
          return ph*.90;
        }
      }
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
            return 65;
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
            return 65;
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
          fy = 0.5,
          fc = 0.999,
          decay = .95,
          alphaTarget = .05;
    
      var dd1 = [{rep:1,total:76}].concat(this.gGrupos[75]);
      var b1 = bolas1.selectAll('circle').data(dd1).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s1 = d3.forceSimulation().nodes(dd1)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b1.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd2 = [{rep:1,total:51}].concat(this.gGrupos[50]);
      var b2 = bolas2.selectAll('circle').data(dd2).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s2 = d3.forceSimulation().nodes(dd2)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b2.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd3 = [{rep:1,total:26}].concat(this.gGrupos[25]);
      var b3 = bolas3.selectAll('circle').data(dd3).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
      let s3 = d3.forceSimulation().nodes(dd3)
                .velocityDecay(decay)
                .alphaTarget(alphaTarget)
                .force("x", d3.forceX(0).strength(fx))
                .force("y", d3.forceY(f=>forcey(f)).strength(fy))
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc).iterations(2))
                .on("tick",()=>{ b3.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd4 = [{rep:1,total:2}].concat(this.gGrupos[0]);
      var b4 = bolas4.selectAll('circle').data(dd4).enter().append("circle").attr("r",f=>{return scalesize(f)-1; }).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f)).on("mouseenter",f=>toolTip(f,event)).on("mouseleave",f=>fechaToolTip(f)).on("click",f=>this.linkPerfil(f));
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
        let o='<div class="governismo" style="background:'+scalecolor(n)+'">';
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
        o+='<div class="t o mt-2">Presença em votações</div><div class="n o">'+Math.round(n.infos.presenca/n.infos.sessoes*100)+'%</div>';
        o+='</div></div>';
        tooltip.html(o);
        tooltip.style("background",scalecolor(n));
        tooltip.attr("class","ativo");
      }
      function fechaToolTip(n){
        let tooltip = d3.select("#tooltip");
        tooltip.attr("class","");
      }
  }

  
}
