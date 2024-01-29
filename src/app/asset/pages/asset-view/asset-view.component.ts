import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTemplate } from '../../../asset-template/model/assetTemplate';
import { AssetSharedService } from '../../../asset-template/services/asset-shared-service/asset-shared.service';
import { AssetTemplateService } from '../../../asset-template/services/assetTemplate/asset-template.service';
import { AssetService } from '../../services/asset/asset.service';
@Component({
  selector: 'app-asset-view',
  templateUrl: './asset-view.component.html',
  styleUrls: ['./asset-view.component.css']
})
export class AssetViewComponent implements OnInit {
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  showLoaderImage: boolean;
  constructor(private globalService: globalSharedService, private assetService: AssetService, private assetSharedService: AssetSharedService, private route: Router, private activeRoute: ActivatedRoute, private assetTemplateService: AssetTemplateService,
    private assetTemplateListService: AssetTemplateService) {
  }
  gateway: any;
  gatewayName:string;
  @Input('childViewModeData') asset: AssetTemplate;
  ngOnInit() {
   this.assetSharedService.getGateway().subscribe(data=>{
    this.gateway=data;
   this.gatewayName=this.gateway[0].name;
   this.assetSharedService.setGatewayName(this.gatewayName);
   });
  }
@Output() navigateTemplate = new EventEmitter();
backButton() {
  this.navigateTemplate.emit('asset');
  this.globalService.setassetViewModeFormViewStatus('editFormViewMode');
}
updateAsset() {
  this.assetObject(this.asset);
  this.globalService.setassetViewModeFormViewStatus('editFormViewMode');
  this.navigateTemplate.emit('assetFormView');
}
assetObject(asset) {
  this.assetSharedService.GetId(asset.id);
  this.assetSharedService.GetRefId(asset.refAssetId);
  this.globalService.setOrganizationDetail('', asset);

}
manageAssetTags() {
  this.globalService.GettingId(this.asset.id);
  this.globalService.GettingString('asset');
  this.globalService.setOrganizationDetail('', this.asset);
  this.globalService.analogAsset(this.asset)
  this.navigateTemplate.emit('manageAssetTags');
}
deleteAsset() {
  this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset!');
}
confirmDelete() {
  this.showLoaderImage = true;
  let userId = sessionStorage.getItem('userId');
  this.assetService.deleteAsset(this.asset.id, Number(userId)).subscribe(res => {
    this.modelNotification.alertMessage(res['messageType'], res['message']);
    this.showLoaderImage = false;
  },
    (error: any) => {
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    }
  );
}
redirectTo() {
  this.route.navigate(['asset-config/asset']);
  this.navigateTemplate.emit('saveAsset');
}
downloadAssetTags() {
  this.globalService.GettingId(this.asset.id);
  this.globalService.GettingString('asset');
  this.globalService.setOrganizationDetail('', this.asset);
  this.globalService.analogAsset(this.asset);
  this.navigateTemplate.emit('downloadAssetTags');
}
}
