import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { Router } from '@angular/router';
import { DiscreteTagService } from '../../services/discreteTag/discrete-tag.service';
import { AssetGatewayIoTagDiscrete } from '../../model/assetGatewayIoTagDiscrete';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-manage-discrete-asset-tag-io-preview',
  templateUrl: './manage-discrete-asset-tag-io-preview.component.html',
  styleUrls: ['./manage-discrete-asset-tag-io-preview.component.css']
})
export class ManageDiscreteAssetTagIoPreviewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;


  assetTagDiscret: AssetTag = new AssetTag();
  showLoaderImage: boolean = false;
  constructor(private globalService: globalSharedService,
    private route: Router, private discreteTagService: DiscreteTagService, private assetSharedService: AssetSharedService) { }

  ngOnInit() {
  }


  // For tab navigate
  @Output() tabName = new EventEmitter();

  // Save & Update AssetTemplate
  manageDiscreteAssettagIo(): void {
    this.showLoaderImage = true;
    this.assetTagDiscret = this.assetSharedService.analogAssetObj;
    let assetTagObj: AssetTag = new AssetTag();
    let assetTagDiscreteStateList: AssetGatewayIoTagDiscrete[] = [];
    assetTagObj.id = this.assetTagDiscret.id;
    assetTagObj.name = this.assetTagDiscret.name;
    assetTagObj.tagType = 'Discrete';
    assetTagObj.isInputEnabled = this.assetTagDiscret.isInputEnabled;
    assetTagObj.isOutputEnabled = this.assetTagDiscret.isOutputEnabled;
    assetTagObj.assetId = this.assetTagDiscret.assetId;
    assetTagObj.dataTypeId = this.assetTagDiscret.dataTypeId;

    let assetGatewayInputList = this.assetTagDiscret.assetGatewayInputTagDiscrete;
    if (assetGatewayInputList != null) {
      assetGatewayInputList.forEach(element => {
        element.ioTagValue.forEach(e => {
          let assetTagDiscreteStateObj: AssetGatewayIoTagDiscrete = new AssetGatewayIoTagDiscrete();
          assetTagDiscreteStateObj.assetTagId = this.assetTagDiscret.id;
          assetTagDiscreteStateObj.gatewayIOTagId = element.gatewayIOTagId;
          assetTagDiscreteStateObj.id = e.id;
          assetTagDiscreteStateObj.asssetTagDiscreteStateId = e.asssetTagDiscreteStateId;
          assetTagDiscreteStateObj.gatewayIoTagValue = e.gatewayIoTagValue;
          assetTagDiscreteStateList.push(assetTagDiscreteStateObj);
        })
      })
    }
    let assetGatewayOutputList = this.assetTagDiscret.assetGatewayOutputTagDiscrete;
    if (assetGatewayOutputList != null) {
      assetGatewayOutputList.forEach(element => {
        element.ioTagValue.forEach(e => {
          let assetTagDiscreteStateObj: AssetGatewayIoTagDiscrete = new AssetGatewayIoTagDiscrete();
          assetTagDiscreteStateObj.assetTagId = this.assetTagDiscret.id;
          assetTagDiscreteStateObj.gatewayIOTagId = element.gatewayIOTagId;
          assetTagDiscreteStateObj.id = e.id;
          assetTagDiscreteStateObj.asssetTagDiscreteStateId = e.asssetTagDiscreteStateId;
          assetTagDiscreteStateObj.gatewayIoTagValue = e.gatewayIoTagValue;
          assetTagDiscreteStateList.push(assetTagDiscreteStateObj);
        })
      })
    }
    assetTagObj.assetGatewayIoTagDiscrete = assetTagDiscreteStateList;
    assetTagObj.createdBy = Number(sessionStorage.getItem("userId"));
    assetTagObj.updatedBy = Number(sessionStorage.getItem("userId"));
    this.discreteTagService.manageIoDiscreteAssetTags(assetTagObj).subscribe(res => {
      this.showLoaderImage = false;
      this.tabName.emit(true);
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.assetSharedService.GetName("");
    },
      (error: any) => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }
  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    //this.globalService.GettingId(this.assetTemplatId);
    this.navigateTemplate.emit('manageDiscreteTagForm');
  }

  // Redirect to
  redirectTo() {
    this.navigateTemplate.emit('discreteTagList');
  }

}
