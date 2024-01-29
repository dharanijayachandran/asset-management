import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AssetAccess, SelectedAssetAccess } from '../../../asset-template/model/assetAccess';
import { Observable } from 'rxjs';
import { ResponseEntity } from 'global/lib/model/Response';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class AssetAccessService {
  apiurl = environment.baseUrl_AssetManagement;

  constructor(private http: HttpClient) { }


  // To get all the records for asset access list
  getAssetAccessList(organizationId: number, acceesGroupId: number): Observable<AssetAccess[]> {
    return this.http.get<AssetAccess[]>(this.apiurl + organizationId + '/asset-access?access-group-id=' + acceesGroupId);
  }

  // Create Asset access
  saveAssetAccess(selectedAssetAccess: SelectedAssetAccess): Observable<ResponseEntity> {
    return this.http.post<ResponseEntity>(this.apiurl + 'asset-access', selectedAssetAccess, httpOptions);
  }
}
