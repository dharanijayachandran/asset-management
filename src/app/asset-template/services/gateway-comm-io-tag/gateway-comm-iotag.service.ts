import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';


@Injectable({
  providedIn: 'root'
})
export class GatewayCommIOTagService {

  constructor(private httpClient: HttpClient) { }

  apiurl = environment.baseUrl_gatewayManagement;

  getGatewayIOTagsByTemplateId(templateId){
    return this.httpClient.get<GatewayIOTag[]>(this.apiurl + 'gatewayIOTagsByGatewayId/' + templateId);
  }

 /*  getDataFormats() {
    return this.httpClient.get<DataProtocolFormat[]>(this.apiurl + 'dataProtocolFormats');
  }

  getGatewayCommIOTagById(id){
    return this.httpClient.get<GatewayCommProtocolIOTag>(this.apiurl + 'gatewayCommIOTagById/'+id);
  }

  saveGatewayCommIOTag(commIOTag:GatewayCommProtocolIOTag){
    return this.httpClient.post<GatewayCommProtocolIOTag>(this.apiurl + 'gatewayCommIOTag',commIOTag)
  }

  updateGatewayCommIOTag(commIOTag:GatewayCommProtocolIOTag){
    return this.httpClient.put<GatewayCommProtocolIOTag>(this.apiurl + 'gatewayCommIOTag',commIOTag)
  }

  deleteGatewayCommIOTag(commIOTag:GatewayCommProtocolIOTag){
    return this.httpClient.put<GatewayCommProtocolIOTag>(this.apiurl + 'gatewayCommIOTagDelete',commIOTag)
  }

  getTagLengthUnits(){
    return this.httpClient.get<TagLengthUnit[]>(this.apiurl + 'tagLengthUnits');
  }

  getGatewayCommIOTagsByGatewayCommProtocolId(gatewayCommProtocolId) {
    return this.httpClient.get<GatewayCommProtocolIOTag[]>(this.apiurl + 'gatewayCommIOTagsByGatewayCommProtocolId/' + gatewayCommProtocolId);
  } */
}
