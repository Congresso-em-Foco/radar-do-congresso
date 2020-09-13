import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GovernismoService } from '../shared/services/governismo.service';

import { ParlamentarAderencia } from '../shared/models/parlamentarAderencia.model';
import { BuscaParlamentarService } from '../shared/services/busca-parlamentar.service';

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private updateService: UpdateService,
    private governismoService: GovernismoService,
    private buscaParlamentarService: BuscaParlamentarService,
  ) { }

  ngOnInit(){
    this.activatedRoute.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.cDate = new Date(2019,0,0);
      this.casa = params.get('casa');
      this.gGeral= {g:0,n:0,total:0,np:0,nv:0};
      this.gTrimestral= {};
      this.gParlamentares= {};
      this.gGrupos= {0:[],25:[],50:[],75:[]};
      this.getParlamentares();
      this.getGovernismo();
    });
  }

  getGovernismo(){
    this.governismoService
    .get(this.casa)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      data => {
        data.forEach(
          t => {
            //data, orientacao, votacoesVoto
            //id, voto
            if(new Date(t.data+" 00:00") >= this.cDate){
              new Date(this.cDate.setMonth(this.cDate.getMonth()+3));
            }
            let dd = this.cDate.toISOString()
            if(!this.gTrimestral[dd]) this.gTrimestral[dd] = {g:0,n:0,total:0};
            this.gGeral.nv++;
            t.votacoesVoto.forEach(v=>{
              if(v.voto == t.orientacao) this.gTrimestral[dd].g ++;
              this.gTrimestral[dd].n ++;
              this.gTrimestral[dd].total = Math.round(this.gTrimestral[dd].g/this.gTrimestral[dd].n*100);

              if(v.voto == t.orientacao) this.gGeral.g ++;
              this.gGeral.n ++;
              this.gGeral.total = Math.round(this.gGeral.g/this.gGeral.n*100);


              // Parlamentar
              if(!this.gParlamentares[v.id]) this.gParlamentares[v.id] = {id:v.id,g:0,n:0,total:0,trimestral:{}};
              if(!this.gParlamentares[v.id].trimestral[dd]) this.gParlamentares[v.id].trimestral[dd] = {g:0,n:0,total:0};
              if(v.voto == t.orientacao) this.gParlamentares[v.id].trimestral[dd].g ++;
              this.gParlamentares[v.id].trimestral[dd].n ++;
              this.gParlamentares[v.id].trimestral[dd].total = Math.round(this.gParlamentares[v.id].trimestral[dd].g/this.gParlamentares[v.id].trimestral[dd].n*100);

              if(v.voto == t.orientacao) this.gParlamentares[v.id].g ++;
              this.gParlamentares[v.id].n ++;
              this.gParlamentares[v.id].total = Math.round(this.gParlamentares[v.id].g/this.gParlamentares[v.id].n*100);
            });
          }    
        );
        Object.values(this.gParlamentares).forEach(p=>{
          if(p["total"]){
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
        });
        this.gGeral.np = Object.values(this.gParlamentares).length;
        this.drawChart();
      },
      error => {
        console.log(error);
      }
    );
  }
  getParlamentares() {
    this.buscaParlamentarService
    .getParlamentarestodos().forEach(
      parlamentares => {
        parlamentares.forEach(p=>{
          if(p.casa === this.casa){
            this.parlamentaresCasa[p.idParlamentarVoz]=p;
          }
        });
      }
    );
  }

  private drawChart(): void {
      let svgNode = document.getElementById('radarControler');
      let svg = d3.select(svgNode);

      let pw = window.innerWidth,
          ph = window.innerHeight*.75 - 80;

      svg.attr('viewbox','0 0 '+pw+' '+ph).attr('width',pw).attr('height',ph+20);
              svg.selectAll("*").remove();

      let g = svg.append('g').attr('transform','translate('+(pw/2)+',0)');
      let estrutura = g.append('g');
      let bolas = g.append('g');

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
      

      /*if(simulation){
        simulation.stop().nodes(this.ddd).alpha(0.5);
      }*/
      

        /*simulation = d3.forceSimulation()
        .nodes(data)
        .force("collide",d3.forceCollide( function(d,i){return d.radius + 6 }).iterations(10).strength(.95) )
        .force("cluster", forceCluster)
        .force("gravity", d3.forceManyBody(.3))
        .force("y", d3.forceY().strength(.5))
        .force("x", d3.forceX().strength(.2))
        .on("tick", tick);*/
                  

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
          return 5;
        }
      }

      var fx = .3,
          fy = .2,
          fc = .7;

      var dd1 = [{rep:1,total:76}].concat(this.gGrupos[75]);
      var b1 = bolas.selectAll('circle').data(dd1).enter().append("circle").attr("r",f=>scalesize(f)).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f));
      let s1 = d3.forceSimulation().nodes(dd1)
                .force("x", d3.forceX(0).strength(fx) )
                .force("y", d3.forceY(0).strength(fy) )
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc) )
                .on("tick",()=>{ b1.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd2 = [{rep:1,total:51}].concat(this.gGrupos[50]);
      var b2 = bolas.selectAll('circle').data(dd2).enter().append("circle").attr("r",f=>scalesize(f)).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f));
      let s2 = d3.forceSimulation().nodes(dd2)
                .force("x", d3.forceX(0).strength(fx) )
                .force("y", d3.forceY(0).strength(fy) )
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc) )
                .on("tick",()=>{ b2.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd3 = [{rep:1,total:26}].concat(this.gGrupos[25]);
      var b3 = bolas.selectAll('circle').data(dd3).enter().append("circle").attr("r",f=>scalesize(f)).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f));
      let s3 = d3.forceSimulation().nodes(dd3)
                .force("x", d3.forceX(0).strength(fx) )
                .force("y", d3.forceY(0).strength(fy) )
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc) )
                .on("tick",()=>{ b3.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

      var dd4 = [{rep:1,total:2}].concat(this.gGrupos[0]);
      var b4 = bolas.selectAll('circle').data(dd4).enter().append("circle").attr("r",f=>scalesize(f)).attr("fill",f=>scalecolor(f)).attr("cy",f=>scaley(f));
      let s4 = d3.forceSimulation().nodes(dd4)
                .force("x", d3.forceX(0).strength(fx) )
                .force("y", d3.forceY(0).strength(fy) )
                .force("collision", d3.forceCollide(f=>scalesize(f)).strength(fc) )
                .on("tick",()=>{ b4.attr('cx',d=>d["x"]).attr('cy',d=>d["y"]); });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}