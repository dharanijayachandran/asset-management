import { AnalogTag } from "./analogTag ";
import { AssetGatewayIoTagAnalog } from "./AssetGatewayIoTagAnalog";
import { AssetGatewayIoTagDiscreteState } from "./AssetGatewayIoTagDiscreteState";
import { AssetTagDiscreteState } from "./AssetTagDiscreteState";

export class generateAssetTag {

    id: number;
    name: string;
    description: string;
    assetId: number;
    assetTemplateTagId: number;
    tagType: string;
    dataTypeId: number;
    engUnitId: number;
    assetStandardTagId:number;
    isInputEnabled: boolean;
    isOutputEnabled: boolean;
    createdBy: number;
    updatedBy: number;
    status: string;
    isSelected: boolean;
    gatewayITagId: number;
    gatewayOTagId: number;
    analogTag: AnalogTag[];
    assetGatewayIoTagAnalog:AssetGatewayIoTagAnalog[];
    assetTagDiscreteState: AssetTagDiscreteState[];
    assetGatewayIoTagDiscreteState:AssetGatewayIoTagDiscreteState[];
    orgAssetStandardTagId: number;
    displayOrder:number;
}