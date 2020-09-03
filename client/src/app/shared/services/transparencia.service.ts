import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransparenciaService {

  private url = 'assets/imgs/base-transparencia.csv';

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(this.url, {responseType: "text"});
  }

}