import { DataProtocolFormat } from './DataProtocolFormat';
import { GatewayTemplate } from './gatewayTemplate'

export class GatewayIOTag {
    gateway: GatewayTemplate;
    nodeId: number;
    nodeComponentId: number;
    name: string;
    tagKeyName: string;
    description: string;
    tagType: string;
    tagIOMode:string;
    dataTypeId: number;
    dataProtocolStandardTag: DataProtocolFormat;
    dataProtocolStandardTagId: number;
    engUnitId: number;
    nodeIoTagTemplateId: number;
    id: number;
    status: string;
    updatedBy: number;
    updatedOn: Date;
    created_by: number;
    createdOn: Date;
    assetStandardTagId:number;
    tagIOModeName: string;
    assetTagDisplayOrder:number;
}