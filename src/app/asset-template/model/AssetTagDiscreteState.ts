import { AssetGatewayIoTagDiscrete } from "./assetGatewayIoTagDiscrete";
import { AssetGatewayIoTagDiscreteState } from "./AssetGatewayIoTagDiscreteState";

export class AssetTagDiscreteState {
    name: String;
    numericValue:number;
    isCommandable: Boolean;
    status: string;
    assetGatewayIoTagDiscrete: AssetGatewayIoTagDiscreteState[];
}