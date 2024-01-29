import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Asset } from 'src/app/shared/model/asset';

@Component({
  selector: 'app-manage-asset-tag',
  templateUrl: './manage-asset-tag.component.html',
  styleUrls: ['./manage-asset-tag.component.css']
})
export class ManageAssetTagComponent implements OnInit {

  constructor(private globalService: globalSharedService, private formBuilder: FormBuilder) { }

  displayPage = '';
  assetTemplate: Asset;
  analogAlarmForm: FormGroup;
  template = true;
  ngOnInit() {
    this.displayPage = 'analogTemplateTagList';
    this.assetTemplate = this.globalService.analogAssetObj;
    if (this.globalService.name == 'asset') {
      this.template = false;
    }
    this.analogAlarmForm = this.formBuilder.group({
      assetTemplateName: [''],
    })
    this.analogAlarmForm.patchValue({
      assetTemplateName: this.assetTemplate.name
    })
  }

  onChange(pageRedirect) {
    this.displayPage = pageRedirect;
  }
  gettingDisplayPage($event) {
    this.displayPage = $event;
  }

  // To navigate based on click form tab or action place
  isEnableSwitchTab = true;
  tabNameMessage(isEnableSwitchTabCondition) {
    this.isEnableSwitchTab = isEnableSwitchTabCondition;
    //this.isEnableSwitchTabStatus();
  }

  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus() {
    setTimeout(() => {
      this.isEnableSwitchTab = true;
    }, 500);
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'manageAnanlogListView' && !this.isEnableSwitchTab ||
      $event.nextId === 'manageDiscrete' && !this.isEnableSwitchTab ||
      $event.nextId === 'manageAlarmConfigListView' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    } else {
      this.navigatePage($event);
    }
  }

  navigatePage($event) {
    if ($event.nextId == 'manageAnanlogListView') {
      this.displayPage = 'analogTemplateTagList';
      this.globalService.setTabName("analogTab");
    }
    else if ($event.nextId == 'manageDiscrete') {
      this.globalService.setTabName("discreteTab");
      this.displayPage = 'discreteTagList';
    }
    else if ($event.nextId == 'manageAlarmConfigListView') {
      this.globalService.setTabName("alarmConfigList");
      this.displayPage = 'alarmConfigList';
    }
  }
}
