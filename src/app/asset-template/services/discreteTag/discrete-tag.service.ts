import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AssetTagDiscreteState } from '../../model/assetTagDiscrete';
import { DiscreteState } from '../../model/discreteState';
import { AssetTag } from '../../model/assetTag';
import { ResponseEntity } from 'global/lib/model/Response';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DiscreteTagService {

  apiurl = environment.baseUrl_AssetManagement;
  constructor(private http: HttpClient) { }


  // To get all discrete list
  getDiscreteTagList(assetId: number,gatewayTemplateId:number): Observable<any[]> {
    return this.http.get<any[]>(this.apiurl + "discreteAssetTagsByAssetId/" + assetId+"/"+gatewayTemplateId);
  }
  discreteStates(): Observable<DiscreteState[]> {
    return this.http.get<DiscreteState[]>(this.apiurl + "discreteStates");
  }
  assetTagDiscreteStates(): Observable<AssetTagDiscreteState[]> {
    return this.http.get<AssetTagDiscreteState[]>(this.apiurl + "discreteAssetTagsStates");
  }

  // Create Discrete Tags
  createDiscreteTags(discreteAssetTag: AssetTag): Observable<AssetTag> {
    return this.http.post<AssetTag>(this.apiurl + 'discreteAssetTags', discreteAssetTag, httpOptions);
  }

  // update Discrete Tags
  updateDiscreteTags(discreteAssetTag: AssetTag): Observable<AssetTag> {
    return this.http.put<AssetTag>(this.apiurl + 'discreteAssetTags', discreteAssetTag, httpOptions);
  }
  deleteDiscreteAssetTag(discreteTagId: number, userId: number): Observable<ResponseEntity> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.delete<ResponseEntity>(`${this.apiurl + 'discreteAssetTags/' + userId + '/' + discreteTagId}`, httpOptions);
  }

  // ManageIO  Discrete Asset Tags
  manageIoDiscreteAssetTags(assetTag: AssetTag): Observable<AssetTag> {
    return this.http.post<AssetTag>(this.apiurl + 'manageIODiscreteAssetTags', assetTag, httpOptions);
  }

}
