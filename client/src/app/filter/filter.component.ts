import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { estados } from '../shared/constants/estados';
import { ParlamentarService } from '../shared/services/parlamentar.service';
import { CasaService } from '../shared/services/casa.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Output() filterChange = new EventEmitter<any>();

  readonly FILTRO_PADRAO_ESTADO = 'Estados';
  readonly FILTRO_PADRAO_PARTIDO = 'Partidos';

  filtro: any;

  private unsubscribe = new Subject();

  partidosPorEstado: any[];

  estados: string[];
  partidosFiltradosPorEstado: string[];

  temaSelecionado: number;
  estadoSelecionado: string;
  nomePesquisado: string;
  partidoSelecionado: string;
  casaSelecionada: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService,
    private casaService: CasaService
  ) {
    this.estados = estados;
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;

    this.filtro = {
      nome: '',
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      tema: this.temaSelecionado,
      default: true
    };
  }

  ngOnInit() {
    this.casaService.get().subscribe(casa => {
      this.casaSelecionada = casa;
      this.getPartidoPorEstado(casa);
      this.aplicarFiltro();
    });
    this.updateFiltroViaUrl();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;

    if (!this.partidosFiltradosPorEstado.includes(this.FILTRO_PADRAO_PARTIDO)) {
      this.partidosFiltradosPorEstado.splice(0, 0, this.FILTRO_PADRAO_PARTIDO);
    }

    if (!this.partidosFiltradosPorEstado.includes(this.partidoSelecionado)) {
      this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    }
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      orientador: undefined,
      casa: this.casaSelecionada,
      default: this.isFiltroDefault()
    };

    this.updateUrlFiltro(this.filtro);

    this.filterChange.emit(this.filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.nomePesquisado = '';

    this.aplicarFiltro();
  }

  limparFiltroEstado() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.onChangeEstado();
    this.aplicarFiltro();
  }

  limparFiltroPartido() {
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.aplicarFiltro();
  }

  getPartidoPorEstado(casa: string) {
    this.parlamentarService
    .getPartidosPorEstado(casa)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      partidos => {
        this.partidosPorEstado = partidos;
        this.onChangeEstado();
      }
    );
  }

  isFiltroDefault() {
    return ((this.filtro.nome === '' || typeof this.filtro.nome === 'undefined') &&
      this.filtro.estado === this.FILTRO_PADRAO_ESTADO &&
      this.filtro.partido === this.FILTRO_PADRAO_PARTIDO);
  }

  private updateUrlFiltro(filtro: any) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (filtro.nome !== '' && filtro.nome !== undefined) {
      queryParams.nome = filtro.nome;
    } else {
      delete queryParams.nome;
    }

    if (filtro.estado !== this.FILTRO_PADRAO_ESTADO) {
      queryParams.estado = filtro.estado;
    } else {
      delete queryParams.estado;
    }

    if (filtro.partido !== this.FILTRO_PADRAO_PARTIDO) {
      queryParams.partido = filtro.partido;
    } else {
      delete queryParams.partido;
    }

    this.router.navigate([], { queryParams });
  }

  private updateFiltroViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        let filtroPresente = false;
        Object.keys(params).forEach(value => {
          if (value === 'nome') {
            this.nomePesquisado = params[value];
            filtroPresente = true;
          }
          if (value === 'estado') {
            this.estadoSelecionado = params[value];
            filtroPresente = true;
          }
          if (value === 'partido') {
            this.partidoSelecionado = params[value];
            filtroPresente = true;
          }
        });

        if (filtroPresente) {
          this.aplicarFiltro();
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
