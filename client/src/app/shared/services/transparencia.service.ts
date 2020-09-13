import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Transparencia } from '../models/transparencia.model';

@Injectable({
  providedIn: 'root'
})
export class TransparenciaService {
  private url = environment.apiUrl + 'transparencia';
  constructor(private http: HttpClient) { }

  get(casa: string): Observable<Transparencia[]> {
    const params = new HttpParams().set('casa', casa);

    return this.http.get<Transparencia[]>(this.url+"/", { params });
  }

}