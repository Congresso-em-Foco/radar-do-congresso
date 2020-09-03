import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Parlamentar } from '../models/parlamentar.model';
import { ParlamentarInfo } from '../models/parlamentarInfo.model';
import { ParlamentarVotos } from '../models/parlamentarVotos.model';
import { ParlamentarProposicoes } from '../models/parlamentarProposicoes.model';
import { ParlamentarGastosCeap } from '../models/parlamentarGastosCeap.model';
import { ParlamentarAssiduidade } from '../models/assiduidade.model';
import { ParlamentarDiscursos } from '../models/parlamentarDiscursos.model';
import { ParlamentarPatrimonio } from '../models/parlamentarPatrimonio.model';
import { ParlamentarEleicao } from '../models/parlamentarEleicao.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarService {
  private url = environment.apiUrl + 'parlamentares';

  constructor(private http: HttpClient) { }

  get(): Observable<Parlamentar[]> {
    return this.http.get<Parlamentar[]>(this.url + '/votacoes');
  }

  getPartidosPorEstado(casa: string): Observable<any[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<any[]>(this.url + '/partidos', { params });
  }

  getProposicoesParlamentarbyId(id: string): Observable<ParlamentarProposicoes> {
    return this.http
      .get<ParlamentarProposicoes>(this.url + '/' + id + '/proposicoes');
  }

  getDiscursosParlamentarById(id: string): Observable<ParlamentarDiscursos> {
    return this.http
      .get<ParlamentarDiscursos>(this.url + '/' + id + '/discursos');
  }

  getPatrimonioById(id: string): Observable<ParlamentarPatrimonio[]> {
    return this.http
      .get<ParlamentarPatrimonio[]>(this.url + '/' + id + '/patrimonio');
  }

  getInfoById(id: string): Observable<ParlamentarInfo> {
    return this.http
      .get<ParlamentarInfo>(this.url + '/' + id + '/info')
      .pipe(map(parlamentar => {
        return new ParlamentarInfo(parlamentar);
      }));
  }

  getVotosbyId(id: string): Observable<ParlamentarVotos> {
    return this.http
      .get<ParlamentarVotos>(this.url + '/' + id + '/votos');
  }

  getGastosCeapByid(id: string): Observable<ParlamentarGastosCeap> {
    return this.http
      .get<ParlamentarGastosCeap>(this.url + '/' + id + '/gastos-ceap');
  }

  getAssiduidadeByid(id: string): Observable<ParlamentarAssiduidade> {
    return this.http
      .get<ParlamentarAssiduidade>(this.url + '/' + id + '/assiduidade');
  }

  getVotosEleicaoByid(id: string): Observable<ParlamentarEleicao> {
    return this.http
      .get<ParlamentarEleicao>(this.url + '/' + id + '/eleicao');
  }
}
