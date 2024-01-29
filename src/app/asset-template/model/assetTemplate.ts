import { AssetParameters } from './assetParameters';

export class AssetTemplate {
  id: number;
  name: string;
  organizationId: number;
  description: string;
  assetCategoryId: number;
  isTemplate: boolean;
  assetTemplateId: number;
  refAssetId: number;
  gateWayTemplateId: number;
  isGenanrateAssetTag: boolean;
  subAssets: AssetTemplate[];
  child: AssetTemplate[];
  createdBy: number;
  updatedBy: number;
  status: string;
  assetCategoryName: string;
  gatewayTemplateName: string;
  assetTemplateName: string;
  assetParams: AssetParameters[];
  visible: boolean;
  hasChild: boolean;
  typeId: number;
  assetTypeName: string;
  isGPSTrackingEnabled: boolean;
  geospatialObjectType: number;
  geospatialObjectTypeName: string;
  geospatialCoordinates: string;
  isTrackingEnable: any;
  isRtDataSharingEnabled: boolean;
  rtDataSharingTopic: string;
  assetOrder: any;
  timeZoneId:any;
  timeZoneName:any;
}