import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Proposicao } from '../models/proposicao.model';

@Injectable({
  providedIn: 'root'
})
export class ProposicaoService {
  private url = environment.apiUrl + 'proposicoes';

  constructor(private http: HttpClient) { }

  getProposicoesVotacoes(casa: string): Observable<Proposicao[]> {
    const params = new HttpParams().set('casa', casa);

    return this.http.get<Proposicao[]>(this.url + '/votacoes', { params });
  }

  getProposicoesImportantes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(this.url + '/importantes');
  }
}
