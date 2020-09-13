import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GovernismoService {
  private url = environment.apiUrl + 'governismo';
  constructor(private http: HttpClient) { }

  get(casa: string): Observable<any>{
    const params = new HttpParams().set('casa', casa);
    return this.http.get<any[]>(this.url, { params });
  }

	getById(id: string): Observable<any>{
    return this.http.get<any>(this.url + '/'+id);
	}

}