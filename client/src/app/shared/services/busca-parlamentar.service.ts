import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import {
  switchMap,
  map,
  tap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';


import { environment } from '../../../environments/environment';
import { ParlamentarAderencia } from '../models/parlamentarAderencia.model';

@Injectable({
  providedIn: 'root'
})
export class BuscaParlamentarService {

  private url = environment.apiUrl + 'busca-parlamentar';

  private searchfilters = new BehaviorSubject<any>({});
  private orderBy;

  private parlamentaresFiltered = new BehaviorSubject<Array<ParlamentarAderencia>>([]);
  private parlamentares = new BehaviorSubject<Array<ParlamentarAderencia>>([]);

  constructor(private http: HttpClient) {
    this.parlamentares
      .pipe(
        switchMap(parlamentar =>
          this.searchfilters.pipe(
            debounceTime(400),
            distinctUntilChanged(
              (p: any, q: any) => {
                return this.compareFilter(p, q);
              }
            ),
            map(filters => this.filter(parlamentar, filters))
          )
        ),
        tap(parlamentares => {
          if (this.orderBy === 'ASC') {
            return parlamentares.sort((a, b) => {
              return this.sort(a, b);
            });
          } else {
            return parlamentares.sort((a, b) => {
              return this.sort(b, a);
            });
          }
        }),
      )
      .subscribe(res => {
        this.parlamentaresFiltered.next(res);
      });
  }

  getParlamentares(): Observable<ParlamentarAderencia[]> {
    this.http
      .get<ParlamentarAderencia[]>(this.url)
      .pipe(map(data => data.map(parlamentar => new ParlamentarAderencia(parlamentar))))
      .subscribe(res => {
        this.parlamentares.next(res);
      });

    return this.parlamentaresFiltered.asObservable();
  }
  getParlamentarestodos(): Observable<ParlamentarAderencia[]> {
    return this.http.get<ParlamentarAderencia[]>(this.url).pipe(map(data => data.map(parlamentar => new ParlamentarAderencia(parlamentar))));
  }

  search(filters: any, orderBy: string) {
    this.orderBy = orderBy;
    this.searchfilters.next(filters);
  }

  filter(parlamentar: ParlamentarAderencia[], filters: any) {
    const estado = filters.estado;
    const nome = filters.nome;
    const partido = filters.partido;
    const casa = filters.casa;

    return parlamentar.filter(p => {
      let filtered;

      filtered =
        casa ? p.casa.toLowerCase() === casa.toLowerCase()
          : true;

      filtered =
        estado && estado !== 'Estados' && filtered
          ? p.uf.toLowerCase() === estado.toLowerCase()
          : filtered;

      filtered =
        partido && partido !== 'Partidos' && filtered
          ? p.parlamentarPartido.sigla.toLowerCase() === partido.toLowerCase()
          : filtered;

      filtered =
        nome && filtered
          ? p.nomeProcessado.toLowerCase().includes(nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
          : filtered;

      return filtered;
    });
  }

  compareFilter(p: any, q: any) {
    return p.estado === q.estado &&
      p.nome === q.nome &&
      p.partido === q.partido &&
      p.casa === q.casa &&
      p.orderBy === q.orderBy;
  }

  sort(a: ParlamentarAderencia, b: ParlamentarAderencia) {
    if (a === undefined) {
      return -1;
    }

    if (b === undefined) {
      return 1;
    }

    if (a !== undefined && b !== undefined) {
      if (a.nomeProcessado > b.nomeProcessado) {
        return 1;
      } else if (a.nomeProcessado < b.nomeProcessado) {
        return -1;
      }
    }
    return 0;
  }

}
