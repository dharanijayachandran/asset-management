import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeZone } from 'global';
import { ResponseEntity } from 'global/lib/model/Response';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetTemplate } from '../../model/assetTemplate';
import { EngUnit } from '../../model/engUnit';
import { GeospatialObectType } from '../../model/GeospatialObectType';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AssetTemplateService {
  apiurl = environment.baseUrl_AssetManagement;
  url = environment.baseUrl_MasterDataManagement
  constructor(private http: HttpClient) { }

  

  // To get all the records for asset template list
  getAssetTemplateList(organizationId: number): Observable<AssetTemplate[]> {
    return this.http.get<AssetTemplate[]>(this.apiurl + 'assetTemplatesByOrganizationId/' + organizationId);
  }

  // Create Asset Template
  createAssetTemplate(assetTemplate: AssetTemplate): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity>(this.apiurl + 'addAssetTemplate', assetTemplate, httpOptions);
  }

  //Update Asset Template
  updateAssetTemplate(assetTemplate: AssetTemplate): Observable<ResponseEntity> {
    return this.http.put<ResponseEntity>(this.apiurl + 'updateAssetTemplate', assetTemplate, httpOptions);
  }
  // Get Asset Category List
  getAssetCategoryList() {
    return this.http.get<AssetTemplate[]>(this.apiurl + 'assetCategory');
  }

  deleteAssetTemplate(assetId: number, userId: number): Observable<ResponseEntity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<ResponseEntity>(`${this.apiurl + 'deleteAssetTemplate/' + userId + '/' + assetId}`, httpOptions);
  }
  
  getEnggUnits(): Observable<EngUnit[]> {
    return this.http.get<EngUnit[]>(environment.baseUrl_gatewayManagement + 'getEnggUnits');
  }
  getGeospatialObjectTypes(): Observable<GeospatialObectType[]> {
    return this.http.get<GeospatialObectType[]>(this.apiurl + 'geospatial-object-types');
  }
  getRtDataSharingTopics(organizationId): Observable<any[]>
  {
    return this.http.get<any[]>(this.apiurl + 'organizations/' + organizationId+'/asset/rt-data-sharing-topic');
  }
  getTimeZoneList(): Observable<TimeZone[]> {
    return this.http.get<TimeZone[]>(this.url+'timezone');
  }
}
