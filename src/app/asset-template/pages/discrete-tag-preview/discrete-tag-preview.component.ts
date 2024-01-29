import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { DiscreteTagService } from '../../services/discreteTag/discrete-tag.service';

@Component({
  selector: 'app-discrete-tag-preview',
  templateUrl: './discrete-tag-preview.component.html',
  styleUrls: ['./discrete-tag-preview.component.css']
})
export class DiscreteTagPreviewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;


  assetTagDiscret: AssetTag = new AssetTag();
  assetTemplatId: number;
  assetTemplateDetails: any;
  showLoaderImage=false;
  constructor(private globalService: globalSharedService,
    private route: Router, private discreteTagService: DiscreteTagService, private assetSharedService: AssetSharedService) { }

  ngOnInit() {
    this.assetTemplatId = this.globalService.listOfRow.id;
    this.assetTemplateDetails=this.globalService.listOfRow;
  }

  // For tab navigate
  @Output() tabName = new EventEmitter();
  // Save & Update AssetTemplate
  createDiscreteState(): void {
    this.showLoaderImage=true;
    this.assetTagDiscret = this.assetSharedService.analogAssetObj;
    this.assetTagDiscret.assetId = this.globalService.listOfRow.id;
    if (this.assetTagDiscret.id == null || this.assetTagDiscret.id == undefined) {
      this.assetTagDiscret.isInputEnabled = false;
      this.assetTagDiscret.isOutputEnabled = false;
      this.assetTagDiscret.tagType = "Discrete";
      this.assetTagDiscret.createdBy = Number(sessionStorage.getItem("userId"));
       this.discreteTagService.createDiscreteTags(this.assetTagDiscret).subscribe(res => {
        this.showLoaderImage=false;
        this.tabName.emit(true);
        // Success response
         this.modelNotification.alertMessage(res['messageType'], res['message']);
       },
         (error: any) => {
          this.showLoaderImage=false;
           // If the service is not available
           this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
         }
       );
    }
    else {
      this.assetTagDiscret.updatedBy = Number(sessionStorage.getItem("userId"));
      this.discreteTagService.updateDiscreteTags(this.assetTagDiscret).subscribe(res => {
        this.showLoaderImage=false;
        this.tabName.emit(true);
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          // If the service is not available
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.globalService.setOrganizationDetail('', this.assetTemplateDetails);
    this.globalService.GettingId(this.assetTemplatId);
    this.navigateTemplate.emit('discreteTemplateForm');
  }

  // Redirect to
  redirectTo() {
    this.navigateTemplate.emit('discreteTagList');
  }
}
