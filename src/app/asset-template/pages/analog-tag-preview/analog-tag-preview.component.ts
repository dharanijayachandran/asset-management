import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AnalogTagService } from '../../services/analogTag/analog-tag.service';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-analog-tag-preview',
  templateUrl: './analog-tag-preview.component.html',
  styleUrls: ['./analog-tag-preview.component.css']
})
export class AnalogTagPreviewComponent implements OnInit {

    // Importing child component to
    @ViewChild(UIModalNotificationPage) modelNotification;

  assetTag: AssetTag;
  backId: any;
  assetTemplateDetail: any;
  showLoaderImage=false;
  constructor(private globalService: globalSharedService,
    private analogTagService: AnalogTagService, private assetSharedService: AssetSharedService) { }

  ngOnInit() {
  }


      // For tab navigate
      @Output() tabName = new EventEmitter();

  // Save analog tags
  @Output() navigateTemplate = new EventEmitter();
  createAnalogTag() {
    this.showLoaderImage=true;
    this.assetTag = this.assetSharedService.analogAssetObj;
    this.assetTag.assetId = this.globalService.listOfRow.id;
    this.assetTag.tagType = "Analog";
    if(this.assetTag.engUnitName!=null || this.assetTag.engUnitName!=undefined){
      this.assetTag.engUnitName="";
    }
    if (this.assetTag.id == null || this.assetTag.id == undefined) {
      this.assetTag.createdBy = Number(sessionStorage.getItem("userId"));
      this.analogTagService.createAnanlogTags(this.assetTag).subscribe((res) => {
        this.showLoaderImage=false;
        this.tabName.emit(true);
         // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      },
        (error: any) => {
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
    else {
      this.assetTag.updatedBy = Number(sessionStorage.getItem("userId"));
      this.analogTagService.updateAnanlogTags(this.assetTag).subscribe((res) => {
        this.showLoaderImage=false;
        this.tabName.emit(true);
        // Success response
        this.modelNotification.alertMessage(res['messageType'], res['message']);

      },
        (error: any) => {
          this.showLoaderImage=false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      );
    }
  }

  // backButton navigate to form view
  backButton(event) {
    this.globalService.GettingId(this.assetTag);
    this.navigateTemplate.emit('analogTemplateFormView');
  }

  // Success response click Okay to got o analog template list page
  analogTemplateTagList(){
    this.globalService.setOrganizationDetail('', this.globalService.listOfRow);
    this.navigateTemplate.emit('analogTemplateTagList');
  }

}
