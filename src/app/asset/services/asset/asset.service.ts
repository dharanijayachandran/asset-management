import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseEntity } from 'global/lib/model/Response';
import { Observable, Subject } from 'rxjs';
import {AssetType } from 'src/app/asset-template/model/AssetType';
import { AssetTemplate } from 'src/app/asset-template/model/assetTemplate';
import { environment } from 'src/environments/environment';
import { timeZoneData } from '../../DTO/timeZone';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AssetService {

    apiurl = environment.baseUrl_AssetManagement;
    baseurl =  environment.baseUrl_gatewayManagement
    constructor(private http: HttpClient) { }
    private dataSourceSubject =  new Subject();
     timeZoneName : any;
    // To get all the records for asset template list
    getAssetList(organizationId: number): Observable<AssetTemplate[]> {
      let userType="";
      if (sessionStorage.getItem("isAdmin") == "true") {
        userType = "Admin";
      }
      let userId = sessionStorage.getItem("userId");
      return this.http.get<AssetTemplate[]>(this.apiurl + 'assetsByOrganizationId/' + organizationId+"?user-id="+userId+"&user-type=" +userType+ "&offset=0&limit=0");
    }
  
    // Create Asset 
    createAsset(assetTemplate: AssetTemplate): Observable<ResponseEntity> {
      return this.http.post<ResponseEntity>(this.apiurl + 'addAsset', assetTemplate, httpOptions);
    }
  
    //Update Asset 
    updateAsset(assetTemplate: AssetTemplate): Observable<ResponseEntity> {
      return this.http.put<ResponseEntity>(this.apiurl + 'updateAsset', assetTemplate, httpOptions);
    }

    deleteAsset(assetId: number, userId: number): Observable<ResponseEntity> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };
      return this.http.delete<ResponseEntity>(`${this.apiurl + 'deleteAsset/' + userId + '/' + assetId}`, httpOptions);
    }
    getAssetTagsByAssetId(assetId): Observable<any[]> {
      return this.http.get<any[]>(this.apiurl + 'assetTags/' + assetId);
    }
    getAccessTypeByOrganizationId(organizationId:number): Observable<AssetType[]> {
      return this.http.get<AssetType[]>(this.apiurl + 'organizations/' + organizationId+'/asset-types');
    }
    getGatewayById(organizationId:number, gatewayId:number):Observable<Object[]>{
      return this.http.get<AssetType[]>(this.baseurl + 'organizations/' + organizationId+'/gateways/'+gatewayId);
      
    } 
    setDataSource(data){
      this.dataSourceSubject.next(data);
    }
    getDataSource(){
      return this.dataSourceSubject.asObservable();
    }
    setTimeZone(name){
      this.timeZoneName = name;
    }
}
