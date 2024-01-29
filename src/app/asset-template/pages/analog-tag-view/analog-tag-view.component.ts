import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';

@Component({
  selector: 'app-analog-tag-view',
  templateUrl: './analog-tag-view.component.html',
  styleUrls: ['./analog-tag-view.component.css']
})
export class AnalogTagViewComponent implements OnInit {
  assetTag: any;

  constructor(private assetSharedService: AssetSharedService, private globalService: globalSharedService) { }

  ngOnInit() {
    this.assetTag = this.assetSharedService.analogAssetObj;
  }

  // For tab navigate
  @Output() tabName = new EventEmitter();

  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();
  backButton(event) {
    this.globalService.setOrganizationDetail("", this.globalService.listOfRow)
    this.navigateTemplate.emit(event);
    this.tabName.emit(false);
    if (event == 'analogTemplateTagList') {
      this.assetSharedService.GetId(null);
    }
  }

}
