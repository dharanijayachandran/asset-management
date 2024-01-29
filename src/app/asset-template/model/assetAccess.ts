export class AssetAccess {
    id: number;
    accessGroupId: number;
    assetId: number;
    assetName: string;
    accessTypeId: number;
    status: string
    createdBy: number;
    updatedBy: number;
    level: number;
    expandable: boolean;
    isSelected: boolean;
    parentAssetId: number;
    isEditable: boolean;
    childAssets: AssetAccess[];
}

export class SelectedAssetAccess {
    assetAccessList: AssetAccess[];
    selectedNodesData: AssetAccess[];

}