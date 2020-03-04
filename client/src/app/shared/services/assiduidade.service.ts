import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Assiduidade } from '../models/assiduidade.model';

@Injectable({
  providedIn: 'root'
})
export class AssiduidadeService {

  private url = environment.apiUrl + 'assiduidade';

  constructor(private http: HttpClient) { }

  get(casa: string, ano: string): Observable<Assiduidade[]> {
    const params = new HttpParams()
      .set('casa', casa)
      .set('ano', ano);
    return this.http.get<Assiduidade[]>(this.url, { params });
  }
}
