import { Component, OnInit, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { GatewayCommIOTagService } from '../../services/gateway-comm-io-tag/gateway-comm-iotag.service';

@Component({
  selector: 'app-analog-tag-read-view',
  templateUrl: './analog-tag-read-view.component.html',
  styleUrls: ['./analog-tag-read-view.component.css']
})
export class AnalogTagReadViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;


  assetTag: AssetTag;
  assetTagId: number;
  inputList: GatewayIOTag[];
  outputList: GatewayIOTag[];
  gateWayTemplateId: any;
  assetTemplateDetail: any;
  inputgatewayIOTagName: GatewayIOTag[];
  outputgatewayIOTagName: GatewayIOTag[];
  gatewayAndTemplateLableName: string;
  constructor(private globalService: globalSharedService,
    private assetSharedService: AssetSharedService,
    private gatewayCommIOTagService: GatewayCommIOTagService) {
  }

  ngOnInit() {
    let requiredPath = document.location.href.split("asset-config/");
    this.gatewayAndTemplateLableName=this.globalService.setGatewayLableName(requiredPath);
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.gateWayTemplateId = this.assetTemplateDetail.gateWayTemplateId;
    this.inputOutputObjList();
    this.assetTag = this.assetSharedService.analogAssetObj;
    this.assetTagId = this.assetSharedService.analogAssetObj.id;
  }

  inputOutputObjList() {
    this.gatewayCommIOTagService.getGatewayIOTagsByTemplateId(this.gateWayTemplateId).subscribe(
      res => {
        let gatewayIoTagList = res;
        this.analogInputOutputTags(gatewayIoTagList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  analogInputOutputTags(gatewayIoTagList: GatewayIOTag[]) {
    this.inputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "A" && e.tagIOMode == "I") {
        return e;
      }
    });

    // To display the name for input Tag Name
    if (this.assetTag.hasOwnProperty('assetInputGatewayIoTagAnalog')) {
      this.inputgatewayIOTagName = this.inputList.filter((item) => {
        return item.id == this.assetTag.assetInputGatewayIoTagAnalog.gatewayIOTagId
      });
    }

    this.outputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "A" && e.tagIOMode == "O") {
        return e;
      }
    });

    // To display the name for Output Tag Name
    if (this.assetTag.hasOwnProperty('assetOutputGatewayIoTagAnalog')) {
      this.outputgatewayIOTagName = this.inputList.filter((item) => {
        return item.id == this.assetTag.assetOutputGatewayIoTagAnalog.gatewayIOTagId
      });
    }

  }


  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(string) {
    this.assetSharedService.GetId(this.assetTag);
    this.navigateTemplate.emit('analogTemplateFormView');
  }

}
