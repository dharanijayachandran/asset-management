import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccessType } from '../../model/accessType';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiurl = environment.baseUrl_MasterDataManagement;


  constructor(private http: HttpClient) { }


  getAccessTypes(){
    return this.http.get<AccessType[]>(this.apiurl + 'access-types');
  }

}
