import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MaskedTextBoxComponent } from "@syncfusion/ej2-angular-inputs";
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { ListView } from '@syncfusion/ej2-lists';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { AssetType } from 'src/app/asset-template/model/AssetType';
import { GeospatialObectType } from 'src/app/asset-template/model/GeospatialObectType';
import { RtDataSharingTopic } from 'src/app/asset-template/model/RtDataSharingTopic';
import { Gateway } from 'src/app/shared/model/gateway';
import { GatewayTemplate } from 'src/app/shared/model/gatewayTemplate';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetCategory } from '../../../asset-template/model/assetCategory';
import { AssetTemplate } from '../../../asset-template/model/assetTemplate';
import { EngUnit } from '../../../asset-template/model/engUnit';
import { AssetSharedService } from '../../../asset-template/services/asset-shared-service/asset-shared.service';
import { AssetTemplateService } from '../../../asset-template/services/assetTemplate/asset-template.service';
import { AssetService } from '../../services/asset/asset.service';
import { GatewayService } from '../../services/gateway/gateway.service';
import { AssetFormViewComponent } from '../asset-form-view/asset-form-view.component';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrls: ['./asset-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AssetListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  @ViewChild(AssetFormViewComponent) assetForm: AssetFormViewComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  @ViewChild('list')
  public list: ListView;
  displayPage: any;
  showLoaderImage: boolean;
  engUnits: EngUnit[] = [];
  assetTypes: AssetType[] = [];
  geospatialObjectTypes: GeospatialObectType[];
  assets: any[];
  assetCategory: AssetCategory[];
  assetTypeByCategorys: any[] = [];
  assetTypeByCategory: any[];
  gettingDisplayPage($event) {
    this.displayPage = $event;
    if ($event == 'saveAsset') {
      this.displayPage = '';
      this.globalService.assetViewModeFormViewStatus = "assetViewMode";
      this.getAssetList();
    }
  }
  timeZoneData:AssetTemplate[]=[];
  allowMultiSelection = false;
  getDataSource: AssetTemplate[] = [];
  asset: AssetTemplate = new AssetTemplate();
  assetTemplate: AssetTemplate[] = [];
  gatewayTemplate: GatewayTemplate[] = [];
  selectedgateWayTemplateId: any;
  field: Object = {};
  navigationSubscription: any;
  gatewayList: Gateway[];
  noRecordsFound = false;
  rtDataSharingTopics: RtDataSharingTopic[] = [];
  assetTypeByCategoryMap = new Map<number, any[]>();
  constructor(private assetService: AssetService, private globalService: globalSharedService,
    private assetTemplateListService: AssetTemplateService, private assetSharedService: AssetSharedService, private gatewayService: GatewayService) {
  }
  public date = new Date();
  gatewayData:any;
  ngOnInit() {
    this.showLoaderImage = true;
    this.getAssetTypes();
    this.getAssetTemplateList();
    this.getGeospatialObjectTypes();
    this.getTimeZoneList();
    this.getAssetList();
    this.getEngUnits();
    this.getRtDataSharingTopics();
  }
  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
  @ViewChild('treeview')
  public tree: TreeViewComponent;
  @ViewChild("maskObj") maskObj: MaskedTextBoxComponent;
  public allowDragAndDrop: boolean = true;
  public nodeChecked(args): void {
    this.globalService.setOrganizationDetail('', args.nodeData);
    if (this.globalService.assetViewModeFormViewStatus == "assetViewMode") {
      for (var e = 0, len = this.getDataSource.length; e < len; e++) {
        if (this.getDataSource[e].id == args.nodeData.id) {
          this.asset = this.getDataSource[e];
          this.getgatewayByid();
          break;
        } else {
          if (this.getDataSource[e].child.length) {
            this.childCheck(this.getDataSource[e].child, args.nodeData.id);
          }
        }
      };
      this.globalService.listOfRow = this.asset;
      this.displayPage = '';
      this.displayPage = 'assetViewMode';
    }
  }
  confirmView() {
    this.globalService.assetViewModeFormViewStatus = "assetViewMode";
    this.displayPage = '';
    this.displayPage = 'assetViewMode';
  }
  childCheck(child, id) {
    for (var e = 0, len = child.length; e < len; e++) {
      if (child[e].id == id) {
        this.asset = child[e];
        this.getgatewayByid();
        break;
      }
      else {
        if (child[e].child.length) {
          this.childCheck(child[e].child, id);
        }
      }
    };
  }
  addAsset(event) {
    this.globalService.setassetViewModeFormViewStatus("addAssetViewMode");
    this.displayPage = 'assetFormView';
  }
  refreshTableListFunction() {
    this.getDataSource = [];
    this.ngOnInit();
  }
  getAssetList() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetService.getAssetList(Number(organizationId)).subscribe(
      res => {
        this.showLoaderImage = false;
        if (Array.isArray(res) && res.length) {
          this.noRecordsFound = false;
          this.assets = JSON.parse(JSON.stringify(res));
          this.getDataSource = this.getFormattedAssetList(this.assets);
          this.assetSharedService.analogAsset(this.getDataSource);
          this.field = this.formatedResponse(this.getDataSource);
          this.globalService.setOrganizationDetail('', this.assets[0]);
          this.asset = this.field['dataSource'][0];
          this.getgatewayByid();
          this.field['dataSource'][0].isSelected = true;
          this.displayPage = 'assetViewMode';
        } else {
          this.field = Object.keys(this.field).length === 0;
          this.noRecordsFound = true;
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  formatedResponse(response) {
    return this.field = {
      dataSource: response,
      id: 'id',
      parentID: 'refAssetId',
      text: 'name',
      hasChildren: 'hasChild',
      selected: 'isSelected'
    };
  }
  //To iterate to get all the assets its call recursively
  assetIterate(assets) {
    const that = this;
    return assets && assets.length ? assets.map(function (o) {
      var returnObj = {
        "id": o.id,
        "name": o.name,
        "refAssetId": o.refAssetId,
        "description": o.description,
        "assetTemplateId": o.assetTemplateId,
        "typeId": o.typeId,
        "assetCategoryId": o.assetCategoryId,
        "assetCategoryName": that.getAssetCategoryName(o.assetCategoryId),
        "gateWayTemplateId": o.gateWayTemplateId,
        "assetTypeName": that.getAssetTypeName(o.typeId),
        "gatewayTemplateName": that.getGatewayTemplateName(o.gateWayTemplateId),
        "assetTemplateName": that.getAssetTemplateName(o.assetTemplateId),
        "isRtDataSharingEnabled": o.isRtDataSharingEnabled,
        "rtDataSharingTopic": o.rtDataSharingTopic,
        "assetOrder": o.assetOrder,
        "status": o.status,
        "timeZoneId":that.getTimeZoneId(o.timeZoneId),
        "expanded": false,
        "geospatialCoordinates": o.geospatialCoordinates,
        "child": that.assetIterate(o.subAssets),
        "assetParams": o.assetParams
      }
      if (o.refAssetId) {
        returnObj["refAssetId"] = o.refAssetId;
      }
      return returnObj;
    }) : [];
  }
  getFormattedAssetList(list) {
    const that = this;
    return list.map(function (l) {
      return {
        id: l.id,
        name: l.name,
        description: l.description,
        assetTemplateId: l.assetTemplateId,
        typeId: l.typeId,
        assetCategoryId: l.assetCategoryId,
        assetCategoryName: that.getAssetCategoryName(l.assetCategoryId),
        gatewayTemplateName: that.getGatewayTemplateName(l.gateWayTemplateId),
        assetTemplateName: that.getAssetTemplateName(l.assetTemplateId),
        gateWayTemplateId: l.gateWayTemplateId,
        geospatialObjectType: l.geospatialObjectType,
        geospatialObjectTypeName: that.setGeospatialObjectTypeName(l.geospatialObjectType),
        isGPSTrackingEnabled: l.isGPSTrackingEnabled,
        geospatialCoordinates: l.geospatialCoordinates,
        assetTypeName: that.getAssetTypeName(l.typeId),
        isRtDataSharingEnabled: l.isRtDataSharingEnabled,
        rtDataSharingTopic: l.rtDataSharingTopic,
        assetOrder: l.assetOrder,
        status: l.status,
        timeZoneId:that.getTimeZoneId(l.timeZoneId),
        expanded: false,
        child: that.assetIterate(l.subAssets),
        assetParams: l.assetParams,
      };
    });
  }
  getAssetCategoryName(assetCategoryId) {
    let assetCategoryName;
    if (this.assetCategory != null) {
      for (let e of this.assetCategory) {
        if (e.id == assetCategoryId) {
          assetCategoryName = e.name;
          break;
        }
      }
    }
    this.assetTypeByCategorys = [];
    this.assetTypes.forEach(assetType => {
      if (assetType.assetCategoryId == assetCategoryId) {
        this.assetTypeByCategorys.push(assetType);
      }
    })
    return assetCategoryName;
  }
  setGatewayId(assetTemplate: AssetTemplate) {
    if (assetTemplate == undefined || assetTemplate == null) {
    } else {
      return this.getGatewayTemplateName(assetTemplate.gateWayTemplateId)
    }

  }


  getAssetTypeName(assetTypeId) {

    let assetTypeName;
    if (this.assetTypeByCategorys != null) {
      for (let e of this.assetTypeByCategorys) {
        if (assetTypeId == e.id) {
          assetTypeName = e.name;
          break;
        }
      }
    }
    return assetTypeName;
  }
  getGatewayTemplateName(gateWayTemplateId) {
    let gatewayTemplateName;
    if (this.gatewayList != null) {
      for (let e of this.gatewayList) {
        if (gateWayTemplateId == e.id) {
          gatewayTemplateName = e.name;
          break;
        }
      }
    }
    return gatewayTemplateName;
  }
  getAssetTemplateName(assetTemplateId) {
    let assetTemplateName;
    if (this.assetTemplate != null) {
      for (let e of this.assetTemplate) {
        if (assetTemplateId == e.id) {
          assetTemplateName = e.name;
          break;
        }
      }
    }
    return assetTemplateName;
  }

  // Get all Asset template List
  getAssetTemplateList() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetTemplateListService.getAssetTemplateList(Number(organizationId)).subscribe(
      res => {
        this.assetTemplate = res;
        this.assetTemplate = this.globalService.addSelectIntoList(this.assetTemplate);
        this.assetSharedService.setAssetTemplateDetails(this.assetTemplate);
      },
      error => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  // Get all Asset Category List
  getAssetTypes() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetService.getAccessTypeByOrganizationId(Number(organizationId)).subscribe(data => {
      // data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.assetTypes = data;
      this.getAssetCategoryList();
      this.assetSharedService.setAssetTypes(this.assetTypes);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  public onDragStop(args: any): void {
    this.getAssetObject(args.draggedNodeData.id);
    if (args.draggedNodeData.id != args.droppedNodeData.id) {
      let refAssetId;
      if (args.dropTarget == null && args.dropTarget == undefined) {
        refAssetId = null;
      }
      else {
        refAssetId = args.droppedNodeData.id;
      }
      this.asset.refAssetId = refAssetId;
      this.asset.organizationId = Number(sessionStorage.getItem("beId"));
      this.asset.isTemplate = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'Do you want to change parent asset?');
    }
    else {
      args.cancel = true;
    }
  }
  confirmDragAndDrop() {
    this.asset.updatedBy = Number(sessionStorage.getItem("userId"));
    this.assetTemplateListService.updateAssetTemplate(this.asset).subscribe(res => {
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }

  getAssetObject(id) {
    for (var element = 0, len = this.assetSharedService.analogAssetObj.length; element < len; element++) {
      if (this.assetSharedService.analogAssetObj[element].id == id) {
        this.asset = this.assetSharedService.analogAssetObj[element];
        break;
      }
      else {
        if (this.assetSharedService.analogAssetObj[element].child.length != 0 && this.assetSharedService.analogAssetObj[element].child != undefined) {
          this.childCheck(this.assetSharedService.analogAssetObj[element].child, id);
        }
      }
    }
  }

  getGateWayList() {
    let organizationId = sessionStorage.getItem('beId');
    this.gatewayService.getGateWayList(organizationId).subscribe(
      res => {
        this.gatewayList = res.filter(e => e.isTemplate == false);
        this.getAssetList();
      },
      error => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }



  getEngUnits() {
    this.assetTemplateListService.getEnggUnits().subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.engUnits = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  /* Search start here */


  filterAsset(filterText: string) {
    let assetDataList = [];
    assetDataList = JSON.parse(JSON.stringify(this.assets));
    if (filterText.length > 0) {
      this.applyFilter(assetDataList, filterText);
      assetDataList = assetDataList.filter(
        node => node.visible === true);
    }
    if (assetDataList.length == 0) {
      this.noRecordsFound = true;
    } else {
      this.noRecordsFound = false;
      this.getDataSource = this.getFormattedAssetList(assetDataList);
      this.field = this.formatedResponse(this.getDataSource);
      this.directiveRef.scrollToTop();
      this.directiveRef.update();
      this.globalService.setOrganizationDetail('', this.assets['dataSource'][0]);
    }

  }

  // Filtering the Nodes by user input
  applyFilter(list, searchString) {
    const that = this;
    let isSubMenusVisible;
    return list.map(function (d) {
      isSubMenusVisible = null;
      if (d.subAssets && d.subAssets.length) {
        d.subAssets = that.applyFilter(d.subAssets, searchString);
        isSubMenusVisible = d.subAssets.filter(function (sm) {
          return sm.visible;
        });
      }
      d.visible = d.name.toLowerCase().includes(searchString.toLowerCase()) || (isSubMenusVisible && isSubMenusVisible.length > 0 ? true : false);
      if (d.subAssets && d.subAssets.length) {
        d.subAssets = d.subAssets.filter(sub => sub.visible)
      }
      return d;
    });
  }
  /* Search end here */


  setGeospatialObjectTypeName(geospatialObjectType: number): string {
    let geospatialObjectTypeName;
    if (this.geospatialObjectTypes) {
      for (let e of this.geospatialObjectTypes) {
        if (e.id == geospatialObjectType) {
          geospatialObjectTypeName = e.name;
          break;
        }

      }
      return geospatialObjectTypeName;
    }
  }

  //Get getGeospatialObjectTypes
  getGeospatialObjectTypes() {
    this.assetTemplateListService.getGeospatialObjectTypes().subscribe(data => {
      this.geospatialObjectTypes = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }


  // Get all Asset Category List
  getAssetCategoryList() {
    this.assetTemplateListService.getAssetCategoryList().subscribe(
      res => {
        this.assetCategory = res;
        this.assetCategory.forEach(category => {
          this.assetTypeByCategory = [];
          this.setAssetTypeByAssetCategoryId(Number(category.id));
        })
        this.globalService.setAssetTypeByAssetCategoryId(this.assetTypeByCategoryMap);
        // this.assetSharedService.setAssetCategoryDetails(this.assetCategory);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        //
      });
  }
  setAssetTypeByAssetCategoryId(assetCategoryId: any) {
    this.assetTypes.forEach(assetType => {
      if (assetType.assetCategoryId == assetCategoryId) {
        this.assetTypeByCategory.push(assetType);
      }
    })
    this.assetTypeByCategoryMap.set(assetCategoryId, this.assetTypeByCategory);
  }
  getRtDataSharingTopics() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetTemplateListService.getRtDataSharingTopics(organizationId).subscribe(
      res => {
        res.forEach(element => {
          let rtDataSharingTopic: RtDataSharingTopic = new RtDataSharingTopic();
          rtDataSharingTopic.name = element;
          this.rtDataSharingTopics.push(rtDataSharingTopic);
        });
        this.globalService.setRtDataSharingTopics(this.rtDataSharingTopics);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
   getgatewayByid(){
     if(null !=this.asset['gateWayTemplateId']){
    let gatewayId = this.asset['gateWayTemplateId'];
    let organizationId = sessionStorage.getItem("beId");
    this.assetService.getGatewayById(Number(organizationId), Number(gatewayId)).subscribe(data => {
      this.assetSharedService.setGateway(data);
    });
  }
  }
  getTimeZoneList() {
    this.assetTemplateListService.getTimeZoneList().subscribe(res => {
      this.timeZoneData = this.globalService.addSelectIntoList(res);
        },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  getTimeZoneId(Id){
    let timeZoneName;
    if (this.timeZoneData) {
      for (let e of this.timeZoneData) {
        if (e.id == Id) {
           timeZoneName = e.name;
          break;
        }
      }
      return timeZoneName;
    }}
}
