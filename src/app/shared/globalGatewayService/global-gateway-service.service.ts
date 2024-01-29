import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { GatewayType } from '../model/gatewayType';
import { GatewayModel } from '../model/gateway-model';

@Injectable({
  providedIn: 'root'
})
export class GlobalGatewayService {

  apiurl = environment.baseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }

  getGatewayTypes(): Observable<GatewayType[]> {
    return this.http.get<GatewayType[]>(this.apiurl + 'getGatewayTypes');
  }

  getGatewayModelsByGatewayTypeId(gatewayTypeId: number): Observable<GatewayModel[]> {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.get<GatewayModel[]>(this.apiurl + 'gateway-models/' + organizationId + "/" + gatewayTypeId);
  }
}
