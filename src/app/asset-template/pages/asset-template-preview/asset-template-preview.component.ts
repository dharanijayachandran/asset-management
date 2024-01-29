import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AssetTemplate } from '../../model/assetTemplate';
import { Router } from '@angular/router';
import { AssetTemplateService } from '../../services/assetTemplate/asset-template.service';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-asset-template-preview',
  templateUrl: './asset-template-preview.component.html',
  styleUrls: ['./asset-template-preview.component.css']
})
export class AssetTemplatePreviewComponent implements OnInit {


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  assetTemplatObj: AssetTemplate = new AssetTemplate();
  assetTemplatId: number;
  showLoaderImage: boolean;
  constructor(private globalService: globalSharedService,
    private assetTemplateListService: AssetTemplateService,
    private route: Router) { }

  ngOnInit() {
    this.assetTemplatId = this.globalService.listOfRow.id;
  }

  // Save & Update AssetTemplate
  createAssetTemplate(): void {
    this.showLoaderImage=true;
    this.assetTemplatObj = this.globalService.listOfRow;
    this.assetTemplatObj.organizationId = Number(sessionStorage.getItem("beId"));
    this.assetTemplatObj.createdBy = Number(sessionStorage.getItem("userId"));
    this.assetTemplatObj.isTemplate = true;

    if (this.assetTemplatObj.id == null || this.assetTemplatObj.id == undefined) {
      this.assetTemplateListService.createAssetTemplate(this.assetTemplatObj).subscribe(res => {
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
    else {
      this.assetTemplatObj.updatedBy = Number(sessionStorage.getItem("userId"));
      this.assetTemplateListService.updateAssetTemplate(this.assetTemplatObj).subscribe(res => {
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

  redirectTo() {
    this.navigateTemplate.emit('templateList');
  }



  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.globalService.GettingId(this.assetTemplatId);
    this.navigateTemplate.emit('templateFormView');
  }

}
