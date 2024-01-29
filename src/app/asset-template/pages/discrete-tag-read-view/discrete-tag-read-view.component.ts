import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AnalogTag } from '../../model/analogTag ';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { AssetTag } from '../../model/assetTag';
import { DiscreteState } from '../../model/discreteState';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';

@Component({
  selector: 'app-discrete-tag-read-view',
  templateUrl: './discrete-tag-read-view.component.html',
  styleUrls: ['./discrete-tag-read-view.component.css']
})
export class DiscreteTagReadViewComponent implements OnInit {
  discreteTag: AssetTag;
  discreateStandardState: DiscreteState[];
  dataTypeList: AnalogTag[];
  assetStandardTagList: AssetStandardTag[] = [];
  constructor(private assetSharedService: AssetSharedService) { }
  assetTemplateId: number
  ngOnInit() {
    this.discreteTag = this.assetSharedService.analogAssetObj;
    this.assetTemplateId = this.assetSharedService.analogAssetObj.id;
    this.discreateStandardState = this.assetSharedService.discreteState;
    this.dataTypeList = this.assetSharedService.dataTypeList;
    this.assetStandardTagList = this.assetSharedService.assetStandardTagList;
  }
  // backButton navigate to form view
  @Output() navigateTemplate = new EventEmitter();

  // For tab navigate
  @Output() tabName = new EventEmitter();

  backButton() {
    this.assetSharedService.GetId(this.discreteTag);
    this.navigateTemplate.emit('discreteTemplateForm');
    this.tabName.emit(false);
    // For tab navigate
  }
  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }
}
