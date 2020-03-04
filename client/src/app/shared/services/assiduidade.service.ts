import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Assiduidade } from '../models/assiduidade.model';

@Injectable({
  providedIn: 'root'
})
export class AssiduidadeService {

  private url = environment.apiUrl + 'assiduidade';

  constructor(private http: HttpClient) { }

  get(): Observable<Assiduidade[]> {
    return this.http.get<Assiduidade[]>(this.url);
  }
}
