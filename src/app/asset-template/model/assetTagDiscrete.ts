import { AssetTag } from './assetTag';
import { DiscreteState } from './discreteState';
import { AssetGatewayIoTagDiscrete } from './assetGatewayIoTagDiscrete';
import { AssetInputGateWayIOTagDiscrete } from './assetInputGateWayIOTagDiscrete';
import { AssetOutputGateWayIOTagDiscrete } from './assetOutputGateWayIOTagDiscrete';

export class AssetTagDiscreteState {
    id: number;
    assetTagId: number;
    discreteStateId: number;
    name: String;
    numericValue:number;
    isCommandable: Boolean;
    assetTag: AssetTag;
    discreteState: DiscreteState;
    assetGatewayIoTagDiscrete: AssetGatewayIoTagDiscrete[];
    assetGatewayInputTagDiscrete: AssetInputGateWayIOTagDiscrete[];
    assetGatewayOutputTagDiscrete: AssetOutputGateWayIOTagDiscrete[];
    createdOn: string;
    createdBy: number;
    updatedOn: string;
    updatedBy: number;
    status: string;
}