import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-template-view',
  templateUrl: './asset-template-view.component.html',
  styleUrls: ['./asset-template-view.component.css']
})
export class AssetTemplateViewComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit() {
  }

  @Output() navigateTemplate = new EventEmitter();
  // backButton form level
  backButton() {
    this.navigateTemplate.emit('templateList');
  }

  gettingDisplayPage(displayPageName){
    this.navigateTemplate.emit(displayPageName);
  }

}
