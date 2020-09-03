import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InqueritosService {

  private url = 'assets/imgs/inqueritos-criminais.csv';

  constructor(private http: HttpClient) { }

  get(){
    return this.http.get(this.url, {responseType: "text"});
  }

}