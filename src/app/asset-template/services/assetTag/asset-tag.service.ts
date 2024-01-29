import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { generateAssetTag } from '../../model/generateAssetTag';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AssetTagService {
  apiurl = environment.baseUrl_AssetManagement;
  constructor(private http: HttpClient) { }

  // To get all the records for asset Tag
  genarateAssetTag(generateAssetTag:generateAssetTag[],id:Number): Observable<generateAssetTag[]> {
    return this.http.post<generateAssetTag[]>(this.apiurl+'addAssetTag/'+id,generateAssetTag,httpOptions);
  }
  getStandardTagsByBId(organizationId:number): Observable<AssetStandardTag[]>{
    return this.http.get<AssetStandardTag[]>(this.apiurl + organizationId+'/asset-standard-tags');
  }

}
