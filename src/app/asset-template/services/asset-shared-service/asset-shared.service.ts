import { Injectable } from '@angular/core';
import { AssetCategory } from '../../model/assetCategory';
import { AssetTemplate } from '../../model/assetTemplate';
import { AnalogTag } from '../../model/analogTag ';
import { DiscreteState } from '../../model/discreteState';
import { AssetTagDiscreteState } from '../../model/assetTagDiscrete';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { GatewayTemplate } from 'src/app/shared/model/gatewayTemplate';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';
import { AssetType } from '../../model/AssetType';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetSharedService {



  assetCategory: AssetCategory[] = [];
  discreteState: DiscreteState[] = [];
  assetTagDiscreteState: AssetTagDiscreteState[] = [];
  assetTemplate: AssetTemplate[] = [];
  gatewayTemplate: GatewayTemplate[] = [];
  engUnitIdList: AnalogTag[] = [];
  dataTypeList: AnalogTag[] = [];
  assetStandardTagList: AssetStandardTag[] = [];
  gatewayInputTagList: GatewayIOTag[] = [];
  gatewayOutputTagList: GatewayIOTag[] = [];
  displayColumns: string[] = [];
  outputDisplayColumns: string[] = [];
  analogAssetObj: any;
  public selectedId = null;
  public refId = null;
  name: string;
  gatewayIoTagList: GatewayIOTag[] = [];
  assetTypes: AssetType[]=[];
  constructor() { }
  private gatewayObject = new Subject();
   gatewayName:any;
  GetId(id) {
    this.selectedId = id;
  }
  GetName(name) {
    this.name = name;
  }
  setAssetCategoryDetails(objectDetail) {
    this.assetCategory = objectDetail;
  }

  setGatewayDetails(objectDetail) {
    this.gatewayTemplate = objectDetail;
  }

  setAssetTemplateDetails(objectDetail) {
    this.assetTemplate = objectDetail;
  }
  analogAsset(objectDetail) {
    this.analogAssetObj = objectDetail;
  }
  setDataTypeList(objectDetail) {
    this.dataTypeList = objectDetail;
  }

  setEngUnitList(objectDetail) {
    this.engUnitIdList = objectDetail;
  }

  setAssetDiscreteStateDetails(objectDetail) {
    this.discreteState = objectDetail;
  }
  setAssetTagDiscreteState(objectDetail) {
    this.assetTagDiscreteState = objectDetail;
  }
  setGatewayOutputList(objectDetail) {
    this.gatewayInputTagList = objectDetail
  }
  setGatewayInputList(objectDetail) {
    this.gatewayOutputTagList = objectDetail
  }
  setInputDisplayColumns(displayColumns) {
    this.displayColumns = displayColumns
  }
  setOutputDisplayColumns(outputDisplayColumns) {
    this.outputDisplayColumns = outputDisplayColumns
  }
  setGatewayIoTagList(objectDetail) {
    this.gatewayIoTagList = objectDetail
  }

  GetRefId(id) {
    this.refId = id;
  }
  setAssetStandardTagList(objectDetail) {
    this.assetStandardTagList = objectDetail;
  }

  globalObject: any;
  setGlobalObject(object: any) {
    this.globalObject = object
  }

  setAssetTypes(assetTypes: AssetType[]) {
    this.assetTypes=assetTypes;
  }
  setGateway(data){
    this.gatewayObject.next(data);
  }
  getGateway(){
    return this.gatewayObject.asObservable();
  }
  setGatewayName(data){
    this.gatewayName=data;
  }
}

