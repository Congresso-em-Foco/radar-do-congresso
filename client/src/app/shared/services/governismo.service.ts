import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Governismo } from '../models/governismo.model';

@Injectable({
  providedIn: 'root'
})
export class GovernismoService {

  private url = environment.apiUrl + 'assiduidade';

  constructor(private http: HttpClient) { }

  get(casa: string, ano: string): Observable<Governismo[]> {
    const params = new HttpParams()
      .set('casa', casa)
      .set('ano', ano);
    return this.http.get<Governismo[]>(this.url, { params });
  }

}
