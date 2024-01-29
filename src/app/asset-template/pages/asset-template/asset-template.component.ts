import { Component, OnInit } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-asset-template',
  templateUrl: './asset-template.component.html',
  styleUrls: ['./asset-template.component.css']
})
export class AssetTemplateComponent implements OnInit {

  displayPage = '';

  constructor() { }

  ngOnInit() {
    this.displayPage = "templateList";
  }

  onChange(){
    this.displayPage = "templateList";
  }

  gettingDisplayPage($event){
    this.displayPage = $event;
  }

  // To navigate based on click form tab or action place
  isEnableSwitchTab = false;
  tabNameMessage() {
    this.isEnableSwitchTab = true;
    this.isEnableSwitchTabStatus();
  }

  // isEnableSwitch status false after one second
  isEnableSwitchTabStatus() {
    setTimeout(() => {
      this.isEnableSwitchTab = false;
    }, 500);
  }

  public beforeChange($event: NgbTabChangeEvent) {
    if ($event.nextId === 'manageTags' && !this.isEnableSwitchTab) {
      $event.preventDefault();
    }
  }

}
