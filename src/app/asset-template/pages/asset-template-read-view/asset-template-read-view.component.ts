import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { UIModalNotificationPage } from 'global';
import { AssetService } from 'src/app/asset/services/asset/asset.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTemplate } from '../../model/assetTemplate';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { AssetTemplateService } from '../../services/assetTemplate/asset-template.service';

@Component({
  selector: 'app-asset-template-read-view',
  templateUrl: './asset-template-read-view.component.html',
  styleUrls: ['./asset-template-read-view.component.css']
})
export class AssetTemplateReadViewComponent implements OnInit {
  constructor(private globalService: globalSharedService,private assetSharedService: AssetSharedService,
    private assetService:AssetService,private assetTemplateListService:AssetTemplateService) { }
  assetTemplate: AssetTemplate;
  assetTemplateId: number;
  timeZoneName:string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  ngOnInit() {
    this.assetTemplate = this.globalService.listOfRow;
    this.assetTemplateId = this.globalService.listOfRow.id;
    this.getTimeZone();
  }
  getTimeZone() {
    this.assetTemplateListService.getTimeZoneList().subscribe(res => {
      let value = this.getFormattedUsersList(res);
      if (this.assetTemplate.timeZoneId != null) {
        value.forEach((e) => {
          if (this.assetTemplate.timeZoneId == e.id) {
            this.timeZoneName = e.name;
          }
        })
        return this.timeZoneName;
      }
        },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  getFormattedUsersList(data){
    return data.map(function (l) {
      return {
        name: l.name,
        id: l.id,
      };
    });
  }
  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.assetTemplateId);
    this.navigateTemplate.emit('templateFormView');
  }

  getAssetCategoryName(assetCategoryId) {
    let assetCategoryName;
    if (this.assetSharedService.assetCategory != null) {
      this.assetSharedService.assetCategory.forEach((e) => {
        if (assetCategoryId == e.id) {
          assetCategoryName = e.name;
        }
      })
    }
    return assetCategoryName;
  }

}
