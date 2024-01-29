import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { AssetOutputGateWayIOTagDiscrete } from '../../model/assetOutputGateWayIOTagDiscrete';
import { AssetInputGateWayIOTagDiscrete } from '../../model/assetInputGateWayIOTagDiscrete';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';

@Component({
  selector: 'app-manage-discrete-asset-tag-io-read-view',
  templateUrl: './manage-discrete-asset-tag-io-read-view.component.html',
  styleUrls: ['./manage-discrete-asset-tag-io-read-view.component.css']
})
export class ManageDiscreteAssetTagIoReadViewComponent implements OnInit {


  assetTag: AssetTag;
  assetTagId: number
  assetTemplateDetails: string;
  assetTagName: string;
  displayColumns: string[];
  outputDisplayColumns: string[];
  gatewayIoTagList: GatewayIOTag[];
  gatewayAndTemplateLableName: string;
  constructor(private globalService: globalSharedService, private assetSharedService: AssetSharedService) { }

  ngOnInit() {
    let requiredPath = document.location.href.split("asset-config/");
    this.gatewayAndTemplateLableName = this.globalService.setGatewayLableName(requiredPath);
    this.assetTag = this.assetSharedService.analogAssetObj;
    this.assetTemplateDetails = this.globalService.listOfRow;
    this.gatewayIoTagList = this.assetSharedService.gatewayIoTagList;
    this.assetTag.assetGatewayInputTagDiscrete = this.setInputGatewayIoTagName(this.assetTag.assetGatewayInputTagDiscrete)
    this.assetTag.assetGatewayOutputTagDiscrete = this.setOutputGatewayIoTagName(this.assetTag.assetGatewayOutputTagDiscrete)
    this.displayColumns = this.assetSharedService.displayColumns;
    //this.outputDisplayColumns = this.assetSharedService.outputDisplayColumns;
  }


  // For tab navigate
  @Output() tabName = new EventEmitter();

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(string) {
    this.assetSharedService.analogAsset(this.assetTag);
    this.globalService.setOrganizationDetail("", this.assetTemplateDetails);
    this.navigateTemplate.emit('manageDiscreteTagForm');
    this.tabName.emit(false);
  }

  setOutputGatewayIoTagName(assetGatewayOutputTagDiscrete: AssetOutputGateWayIOTagDiscrete[]) {
    this.gatewayIoTagList.forEach(e => {
      assetGatewayOutputTagDiscrete.forEach(e1 => {
        if (e.id == e1.gatewayIOTagId) {
          e1.gatewayIoTagName = e.name
        }
      });
    });
    return assetGatewayOutputTagDiscrete;
  }
  setInputGatewayIoTagName(assetGatewayInputTagDiscrete: AssetInputGateWayIOTagDiscrete[]) {
    this.gatewayIoTagList.forEach(e => {
      assetGatewayInputTagDiscrete.forEach(e1 => {
        if (e.id == e1.gatewayIOTagId) {
          e1.gatewayIoTagName = e.name
        }
      });
    });
    return assetGatewayInputTagDiscrete
  }
}
