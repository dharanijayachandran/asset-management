import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CommonUnitService {
  apiurl = environment.baseUrl_gatewayManagement;
  constructor(private http: HttpClient) { }

  getDataTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getDataTypes');
  }

  getUIComponentTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getUIComponentTypes');
  }

  getEnggUnits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getEnggUnits');
  }
  getCommunicationStandards(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getCommunicationStandards');
  }

  getStandardIOTags(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getStandardIOTags');
  }

  getTagTypes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getTagTypes');
  }
  getTagIOMode(): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + 'getTagIOMode');
  }
}
