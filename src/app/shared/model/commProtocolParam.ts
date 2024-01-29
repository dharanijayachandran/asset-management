import { CommProtocol } from './commprotocol';
import { CommProtocolParamValue } from './commProtocolParamValue';
import { CommProtocolParamGroup } from './commProtocolParamGroup';

export class CommProtocolParam{
    id:number;
    commProtocolId:number;
    commProtocolParamGroupId:number;
    description:String;
    dataTypeId:number;
    engUnitId:number;
    isNull:boolean;
    defaultValue:String;
    refCommProtocolParamId:number;
    refCommProtocolParamVauleId:number;
    uiComponentTypeId:number;
    displayOrder:number;
    commProtocolName:String;
    commProtocolParamGroupName:String;
    dataTypeName:String;
    engUnitName:String;
    uiComponentTypeName:String;
    name:String;
    status:String;
    commProtocolLevel:String;
    updatedBy:number;
    updatedOn:Date;
    createdBy:number;
    createdOn: Date;
    commProtocol:CommProtocol;
    commProtocolParamGroup: CommProtocolParamGroup;
    commProtocolParamValues:CommProtocolParamValue[];
}