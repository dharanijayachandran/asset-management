import { AssetTagDiscreteState } from './assetTagDiscrete';

export class DiscreteState {
    id:number;
    organizationId: number;
    name: String;
    isCommandable: Boolean;
    assetTagDiscreteState: AssetTagDiscreteState[];
}