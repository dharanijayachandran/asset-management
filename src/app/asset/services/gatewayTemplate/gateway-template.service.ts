import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GatewayTemplateIOTag } from 'src/app/shared/model/gateway-template-io-tag';
import { GatewayTemplate } from 'src/app/shared/model/gatewayTemplate';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayTemplateService {

  apiurl = environment.baseUrl_gatewayManagement;
  assetApiUrl = environment.baseUrl_AssetManagement;

  constructor(private http: HttpClient) { }

  getGatewayTemplatesList(id): Observable<GatewayTemplate[]> {
    return this.http.get<GatewayTemplate[]>(this.apiurl + 'gatewayTemplatesByBusinessEntityId/' + id);
  }
  getGatewayTemplateIOTagByGatewayTemplateId(gatewayTemplateId): Observable<GatewayTemplateIOTag[]> {
    return this.http.get<GatewayTemplateIOTag[]>(this.apiurl + 'getAllGatewayIOTagByGatewayId/' + gatewayTemplateId);
  }
  /*
    getGatewayTemplateByTemplateId(id: number): Observable<GatewayTemplate> {
      return this.http.get<GatewayTemplate>(this.apiurl + 'gatewayTemplateById/' + id);
    } */

  getGatewaysByTemplateId(gatewayTemplateId: number): Observable<GatewayTemplate[]> {
    let organizationId = sessionStorage.getItem("beId");
    return this.http.get<GatewayTemplate[]>(this.assetApiUrl + 'organization/' + organizationId + '/gateways?gateway-template-id=' + gatewayTemplateId);
  }
  /*  deleteGatewayTemplate(id, userId): Observable<void> {
     return this.http.delete<void>(`${this.apiurl + 'gatewayTemplate/' + id + '/' + userId}`, httpOptions);
   }

   getCommProtocols(): Observable<GatewayCommProtocol[]> {
     return this.http.get<GatewayCommProtocol[]>(this.apiurl + 'getAllProtocol');
   }

   getDataProtocols(): Observable<DataProtocol[]> {
     return this.http.get<DataProtocol[]>(this.apiurl + 'dataProtocols');
   }

   getDataProtocolsByCommProtocolId(commProtocolId: number): Observable<DataProtocol[]> {
     return this.http.get<DataProtocol[]>(this.apiurl + 'dataProtocolsByCommProtocolId/' + commProtocolId);
   } */
}
