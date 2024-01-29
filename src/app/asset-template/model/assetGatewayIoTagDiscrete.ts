import { AssetTag } from './assetTag';
import { AssetTagDiscreteState } from './assetTagDiscrete';
import { IOTagValue } from './IOTagValue';

export class AssetGatewayIoTagDiscrete {
    id:number;
    assetTagId: number;
    asssetTagDiscreteStateId: number;
    gatewayIOTagId: number;
    gatewayIoTagValue: number;
    gatewayIoTagName:string
    assetTag: AssetTag;
    assetTagDiscreteState: AssetTagDiscreteState;
    asssetTagDiscreteStateName:string;
    ioTagValue:IOTagValue[]
    numericValue;
    name:string;
}