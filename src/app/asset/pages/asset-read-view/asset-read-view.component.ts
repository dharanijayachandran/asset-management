import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIModalNotificationPage } from 'global';
import 'rxjs/add/observable/combineLatest';
import { AssetTemplateService } from 'src/app/asset-template/services/assetTemplate/asset-template.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTemplate } from '../../../asset-template/model/assetTemplate';
import { AssetSharedService } from '../../../asset-template/services/asset-shared-service/asset-shared.service';
import { AssetService } from '../../services/asset/asset.service';

@Component({
  selector: 'app-asset-read-view',
  templateUrl: './asset-read-view.component.html',
  styleUrls: ['./asset-read-view.component.css']
})
export class AssetReadViewComponent implements OnInit {
  navigationSubscription: any;
  parametersObservable: any;
  selected_id: any;
  assetTemplate: AssetTemplate[];
  constructor(private assetSharedService: AssetSharedService,private globalService: globalSharedService, private activeRoute: ActivatedRoute, private router: Router,
    private assetService:AssetService,private assetTemplateListService:AssetTemplateService) {
  }
  asset: AssetTemplate;
  assetId: number;
  timeZoneName:string;
  @ViewChild(UIModalNotificationPage) modelNotification;
  ngOnInit() {
    this.asset = this.globalService.listOfRow;
    this.assetId = this.globalService.listOfRow.id;
    this.assetTemplate=this.assetSharedService.assetTemplate;
   this.getAssetTemplateName(this.globalService.listOfRow.assetTemplateId);
   this.getTimeZone();
  }
  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton() {
    this.globalService.GettingId(this.assetId);
    this.navigateTemplate.emit('assetFormView');
    // this.router.navigate(['asset/assetFormView']);
  }
  getAssetTemplateName(assetTemplateId) {
    let assetTemplateName;
    if (this.assetTemplate != null) {
      this.assetTemplate.forEach((e) => {
        if (assetTemplateId == e.id) {
          assetTemplateName = e.name;
        }
      })
    }
    return this.asset.assetTemplateName=assetTemplateName;
  }
  getTimeZone() {
    this.assetTemplateListService.getTimeZoneList().subscribe(res => {
      let value = this.getFormattedUsersList(res);
      if (this.asset.timeZoneId != null) {
        value.forEach((e) => {
          if (this.asset.timeZoneId == e.id) {
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
}
