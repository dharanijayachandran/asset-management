import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Gateway } from 'src/app/shared/model/gateway';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class GatewayService {

  apiurl = environment.baseUrl_gatewayManagement;
  assetApiUrl = environment.baseUrl_AssetManagement;
  // assetApiUrl=environment.loacalBaseUrl_AssetManagement;
  // localGatewayApiUrl=environment.localBaseUrl_gatewayManagement;

  constructor(private http: HttpClient) { }

  // To get all Gatway list
  getGateWayList(organizationId): Observable<Gateway[]> {
    return this.http.get<Gateway[]>(this.apiurl + 'gatewaysByOrganizationId/' + organizationId);
  }

  //createGateway
  createGateway(gateway:Gateway[]): Observable<Gateway[]> {
    return this.http.post<Gateway[]>(`${this.apiurl + 'gateway'}`, gateway, httpOptions);
  }

  // updateGateway
  updateGateway(gateway): Observable<Gateway> {
    return this.http.put<Gateway>(`${this.apiurl + 'gateway'}`, gateway, httpOptions);
  }
  getGatewayById(gatewayId: any) {
    return this.http.get<Gateway>(this.apiurl + 'gatewayById/' + gatewayId);
  }



  checkAvailability(nodeIdentifier): Observable<boolean> {
    return this.http.get<boolean>(this.apiurl + 'checkAvailability/' + nodeIdentifier);
  }
  uploadTemplate(formData, beId): Observable<any> {
    return this.http.post<any>(`${this.apiurl + 'uploadTemplate?organizationId=' + beId}`, formData, httpOptions);
  }
  getAssetTemplates(gatewatTemplateId) {
    return this.http.get<any[]>(this.assetApiUrl + 'assetTemplatesByGatewayTemplateId/' + gatewatTemplateId);
  }

  downloadTemplateData(downloadTemplate: Gateway): Observable<any> {

    return this.http.post<any>(this.apiurl + 'downloadTemplate', downloadTemplate, { observe: 'response', responseType: 'blob' as 'json' });
  }

  clearGatewayIdentifier(gatewayIdentifier: string): Observable<void> {
    return this.http.delete<void>(`${this.apiurl + 'gateway/' + gatewayIdentifier}`, httpOptions);
  }

  /* getNodeIdentifier(): Observable<string> {
    return this.http.get<string>(this.apiurl + 'generateRandomCombinedCharacters');
  } */

  getAuthToken(): Observable<string> {
    return this.http.get<string>(this.apiurl + 'gateway/authToken');
  }

  saveExcelGateways(gateways): Observable<any> {
    return this.http.post<any>(`${this.apiurl + 'gateways'}`, gateways, httpOptions);
  }
  getGateways(): Observable<Gateway[]> {
    let beId = sessionStorage.getItem('beId');
    return this.http.get<Gateway[]>(environment.baseUrl_gatewayManagement +'gatewayTemplatesByBusinessEntityId/' + beId);
  }
}


