import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTemplate } from '../../../asset-template/model/assetTemplate';
import { AssetService } from '../../services/asset/asset.service';

@Component({
  selector: 'app-asset-preview',
  templateUrl: './asset-preview.component.html',
  styleUrls: ['./asset-preview.component.css']
})
export class AssetPreviewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  assetTemplatObj: AssetTemplate = new AssetTemplate();
  assetId: number;
  showLoaderImage: boolean;
  constructor(private globalService: globalSharedService,
    private assetService: AssetService,
    private route: Router) { }

  ngOnInit() {
    this.assetId = this.globalService.listOfRow.id;
  }

  // Save Asset
  createAsset(): void {
    this.showLoaderImage=true;
    //  assetListComponent:AssetListComponent=new  AssetListComponent();
    this.assetTemplatObj = this.globalService.listOfRow;
    this.assetTemplatObj.assetParams.forEach((e)=>{
      e.engUnitName=null;
   })
    this.assetTemplatObj.organizationId = Number(sessionStorage.getItem("beId"));
    this.assetTemplatObj.isTemplate = false;
    if (this.assetTemplatObj.id == null || this.assetTemplatObj.id == undefined) {
      this.assetTemplatObj.createdBy = Number(sessionStorage.getItem("userId"));
      this.assetService.createAsset(this.assetTemplatObj).subscribe(res => {
        this.showLoaderImage=false;
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          // If the service is not available
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.assetTemplatObj.updatedBy = Number(sessionStorage.getItem("userId"));
      this.assetService.updateAsset(this.assetTemplatObj).subscribe(res => {
         // Success response
         this.showLoaderImage=false;
         this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          // If the service is not available
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }


  // Redirect to
  redirectTo() {
    sessionStorage.setItem("assetView", "view")
    this.navigateTemplate.emit('saveAsset');
  }

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.assetId);
    this.globalService.setAssetDetail(this.globalService.listOfRow);
    this.navigateTemplate.emit('assetFormView');
  }

}
