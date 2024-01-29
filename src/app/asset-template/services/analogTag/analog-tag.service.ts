import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalogTag } from '../../model/analogTag ';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssetTag } from '../../model/assetTag';
import { DataType } from '../../model/dataType';
import { EngUnit } from '../../model/engUnit';
import { AlarmConfig } from '../../model/AlarmConfig';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { ResponseEntity } from 'global/lib/model/Response';
import { AlarmTypes } from '../../model/alarmTypes';
import { AssetTemplate } from '../../model/assetTemplate';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AnalogTagService {
  apiurl = environment.baseUrl_AssetManagement;
  alarmApiUrl = environment.baseUrl_AlarmManagement;
  organizationApiUrl = environment.baseUrl_OrganizationManagement;
  masterApiurl = environment.baseUrl_MasterDataManagement;
  constructor(private http: HttpClient) { }

  // To get all analog list
  getAnalogTagList(assetId: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + "analogAssetTagsByAssetId/" + assetId);
  }

  getDataTypes(): Observable<DataType[]> {
    return this.http.get<DataType[]>(environment.baseUrl_gatewayManagement + 'getDataTypes');
  }

  getEnggUnits(): Observable<EngUnit[]> {
    return this.http.get<EngUnit[]>(environment.baseUrl_gatewayManagement + 'getEnggUnits');
  }
  getAssetStandardTagList(): Observable<AssetStandardTag[]> {
    return this.http.get<AssetStandardTag[]>(this.apiurl + 'assetStandardTags');
  }
  // Get Input Output List
  getinputOutputList() {
    return this.http.get<AnalogTag[]>('');
  }
  // Create Analog Tags
  createAnanlogTags(assetTag: AssetTag): Observable<AssetTag> {
    return this.http.post<AssetTag>(this.apiurl + 'addAssetTag', assetTag, httpOptions);
  }

  // update Analog Tags
  updateAnanlogTags(assetTag: AssetTag): Observable<AssetTag> {
    return this.http.put<AssetTag>(this.apiurl + 'updateAnalogAssetTag', assetTag, httpOptions);
  }
  // delete Analog asset tag
  deleteAnalogAssetTag(analogTagId: number, userId: number): Observable<ResponseEntity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<ResponseEntity>(`${this.apiurl + 'analogAssetTag/' + userId + '/' + analogTagId}`, httpOptions);
  }

  getAlarmTypesForAnalog() {
    return this.http.get<AlarmTypes[]>(this.masterApiurl + 'alarm-types')
  }

  saveAlarmConfigForAnalogAssetTag(alarmConfigWithAsset: any): any {
    return this.http.post<any>(this.alarmApiUrl + 'alarmConfig', alarmConfigWithAsset);
  }

  updateAlarmConfigForAnalogAssetTag(alarmConfig: AlarmConfig): any {
    return this.http.put<any>(this.alarmApiUrl + 'alarmConfigWithNotificationDetails', alarmConfig);
  }

  getAlarmConfigById(id: number): Observable<AlarmConfig> {
    return this.http.get<AlarmConfig>(this.alarmApiUrl + 'alarmConfig/' + id);
  }

  getAlarmTypesForDiscrete() {
    return this.http.get<any[]>(this.alarmApiUrl + 'discreteAlarmTypes')
  }

  getAlarmStates() {
    return this.http.get<any[]>(this.alarmApiUrl + 'alarmStates')
  }

  getAlarmSeveritys() {
    return this.http.get<any[]>(this.apiurl + 'alarm-severitys')
  }

  getNotificationMedia() {
    return this.http.get<any[]>(this.organizationApiUrl + 'notificationGroup/notificationMedia')
  }

  getNotofcationGroupByOrgId(beId: number) {
    return this.http.get<any[]>(this.organizationApiUrl + 'notificationGroup/' + beId)
  }

  getNotioficationConfigsByOrgId(beId: number, entityId: number, alarmTypeId: number, entityTypeId: number) {
    let url = 'alarmConfigsByOrganizationId?organizationId=' + beId
    if (null != entityTypeId) {
      url = url + "&entityTypeId=" + entityTypeId;
    } else {
      url = url + "&entityTypeId=";
    }
    if (null != entityId) {
      url = url + "&entityId=" + entityId;
    } else {
      url = url + "&entityId=";
    }
    if (null != entityTypeId) {
      url = url + "&alarmTypeId=" + alarmTypeId;
    } else {
      url = url + "&alarmTypeId=";
    }
    return this.http.get<any[]>(this.alarmApiUrl + url)
  }

  deleteAlarmConfig(id, userId) {
    return this.http.delete<any[]>(this.alarmApiUrl + 'alarmConfigWithNotificationDetails/' + id + '/' + userId)
  }

  getNotificationGroupMedia() {
    return this.http.get<any[]>(this.organizationApiUrl + 'notificationGroup/notificationGroupMedia')
  }

  getAssetTagDiscreteStates(id) {
    return this.http.get<any[]>(this.alarmApiUrl + 'discreteAssetTagStatesByAssetTag/' + id)
  }

  saveAlarmConfigForDiscreteAssetTag(alarmConfig: any) {
    return this.http.post<any>(this.alarmApiUrl + 'discreteAlarmConfigWithNotificationDetails', alarmConfig);
  }

  updateAlarmConfigForDiscreteAssetTag(alarmConfig: AlarmConfig): any {
    return this.http.put<any>(this.alarmApiUrl + 'discreteAlarmConfigWithNotificationDetails', alarmConfig);
  }
  getAssetsById(id): Observable<AssetTemplate> {
    return this.http.get<AssetTemplate>(this.alarmApiUrl + 'assets/' + id)
  }
}
