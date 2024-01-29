import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UIModalNotificationPage } from 'global';
import { GatewayTemplateService } from 'src/app/asset/services/gatewayTemplate/gateway-template.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';
import { AssetTagService } from '../../services/assetTag/asset-tag.service';
import { AssetTemplateService } from '../../services/assetTemplate/asset-template.service';
import { EngUnit } from '../../model/engUnit';
import { AssetStandardTag, AssetStandardTagValues } from '../../model/AssetStandardTag';
import { generateAssetTag } from '../../model/generateAssetTag';
import { AssetGatewayIoTagAnalog } from '../../model/AssetGatewayIoTagAnalog';
import { AssetGatewayIoTagDiscreteState } from '../../model/AssetGatewayIoTagDiscreteState';
import { AssetTagDiscreteState } from '../../model/AssetTagDiscreteState';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-generate-asset-tag',
  templateUrl: './generate-asset-tag.component.html',
  styleUrls: ['./generate-asset-tag.component.css']
})
export class GenerateAssetTagComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  generateAssetBlock = false;
  dataSource: any;
  assetTamplateDetail: any;
  _confirmed = false;
  datasourceCopy: any;
  selection = new SelectionModel<GatewayIOTag>(true, []);
  gatewayIOTagList: GatewayIOTag[] = [];
  noRecordBlock = false;
  displayedColumns: string[] = ['id', 'name', 'IO Tag Mode', 'standard tag', 'engg unit', 'order', 'select'];
  warningFlag: string;
  showLoaderImage: boolean;
  checkBoxToolTip: string = "Select All";
  engUnits: EngUnit[];
  assetStandardTags: AssetStandardTag[];
  AssetStandardTagValues: AssetStandardTagValues[] = [];
  // assetStandardTagDropdown: number[] = [];
  dataField: object = { text: 'name', value: 'id' }
  public filterPlaceholder: string = 'Search';
  public height: string = '220px';
  public sortDropDown: string = 'Ascending';
  public value: any;
  GenerateTagForm: FormGroup;

  constructor(private gatewayTemplateService: GatewayTemplateService, private assetTagService: AssetTagService, private globalService: globalSharedService, private assetTempalateServices: AssetTemplateService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.loadGenerateTagForm();
    let organizationId = sessionStorage.getItem("beId");
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.tagIOModeName.toLowerCase().includes(filter);
    };
    this.getEnggUnits();
    this.getStandardTagsByBId(organizationId);
    this.showLoaderImage = true;
    this.getGatewayTemplateIOTagByGateway();
  }
  loadGenerateTagForm() {
    this.GenerateTagForm = this.formBuilder.group({
      AssetStandardTagValues: this.formBuilder.array([])
    })
  }
  // Refresh table
  refreshTableListFunction() {
    // To get all the records for Asset Tag
    this.getGatewayTemplateIOTagByGateway();
  }

  getGatewayTemplateIOTagByGateway() {
    this.assetTamplateDetail = this.globalService.listOfRow;
    let id = this.assetTamplateDetail.gateWayTemplateId;
    this.getGatewayTemplateIOTagByGatewayId(id);
  }

  // Mat sorting for if use ngIf condition to show table starts here======================

  @ViewChild(MatSort) sort: MatSort

  getGatewayTemplateIOTagByGatewayId(gatewayTemplateId: number) {
    this.gatewayTemplateService.getGatewayTemplateIOTagByGatewayTemplateId(gatewayTemplateId)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          this.gettingAssetTag(res);
        },
        error => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }


  gettingAssetTag(res) {
    if (Array.isArray(res) && res.length) {
      this.gatewayIOTagList = res;
      this.gatewayIOTagList.forEach(element => {
        if(element.tagIOMode==="I"){
          element.tagIOModeName="INPUT";
        }
        if(element.tagIOMode==="O"){
          element.tagIOModeName="OUTPUT";
        }
      });
      this.gatewayIOTagList = this.gatewayIOTagList.sort((a, b) => b.id - a.id);
      this.dataSource.data = this.gatewayIOTagList;
      let assetStandardEntityList: AssetStandardTagValues[] = [];
      for (let i = 0; i < this.dataSource.data.length; i++) {
        assetStandardEntityList.push(this.dataSource.data[i].dataProtocolStandardTagId);
      }
      this.GenerateTagForm.setControl('AssetStandardTagValues', this.patchFormArrayData(assetStandardEntityList));
      this.dataSource.sort = this.sort;
      this.generateAssetBlock = true;
    } else {
      this.noRecordBlock = true;
    }
  }

  // Cancel Asset Tag
  CancelAssetTag() {
    if (this.selection.selected.length != 0) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  // Confirm redirect to
  formCancelConfirm() {
    let manageAssetListView = document.getElementById('manageAssetListView');
    manageAssetListView.click();
    this.navigateTemplate.emit('templateList');
  }

  // Reset Asset Template
  resetAssetTag() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.updateCheckboxStatus(this.gatewayIOTagList);
    this.gatewayIOTagList=[];
    this.getEnggUnits();
    this.getStandardTagsByBId(sessionStorage.getItem("beId"));

  }


  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
      this.assetStandardTags=[];
      this.engUnits=[];
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }

  // SaveAssetTag
  @Output() navigateTemplate = new EventEmitter();
  SaveAssetTag() {
    let i = 0;
    this.showLoaderImage = true;
    let createdBy = sessionStorage.getItem("userId");
    let generateAssetTags: generateAssetTag[] = [];
    let generateTagValue = [];
    this.GenerateTagForm.value.AssetStandardTagValues.forEach(element => {
      if (element.generateTags != null || element.standardTag != null) {
        generateTagValue.push(element);
      }
    })
    this.selection.selected.forEach(element => {
      let gatewayIoTag: GatewayIOTag = new GatewayIOTag();
      gatewayIoTag = element;
      let assetTag: generateAssetTag = new generateAssetTag();
      assetTag.assetId = this.assetTamplateDetail.id;
      assetTag.name = gatewayIoTag.name;
      assetTag.description = gatewayIoTag.description;
      assetTag.tagType = gatewayIoTag.tagType;
      assetTag.dataTypeId = gatewayIoTag.dataTypeId;
      assetTag.createdBy = Number(createdBy);
      if (generateTagValue[i].standardTag != "") {
        assetTag.orgAssetStandardTagId= generateTagValue[i].standardTag;
      }
      if (generateTagValue[i].generateTags != "") {
        assetTag.engUnitId= generateTagValue[i].generateTags;
      }
      i++;
      assetTag.displayOrder=gatewayIoTag.assetTagDisplayOrder;
      if (gatewayIoTag.tagIOMode === "I") {
        assetTag.isInputEnabled = true;
      }else{
        assetTag.isInputEnabled = false;
      }
      if (gatewayIoTag.tagIOMode === "O") {
        assetTag.isOutputEnabled = true;
      }else{
        assetTag.isOutputEnabled = false;
      }
      let assetGatewayIoTagAnalog = this.setAssetGatewayIoTagAnalog(gatewayIoTag);
      if (assetGatewayIoTagAnalog != null || assetGatewayIoTagAnalog != undefined) {
        assetTag.assetGatewayIoTagAnalog = this.setAssetGatewayIoTagAnalog(gatewayIoTag);
      }
      let setAssetTagDiscreteState = this.setAssetTagDiscreteState(gatewayIoTag);
      if (setAssetTagDiscreteState != null || setAssetTagDiscreteState != undefined) {
        assetTag.assetTagDiscreteState = setAssetTagDiscreteState;

      }
      generateAssetTags.push(assetTag);
    })
    this.assetTagService.genarateAssetTag(generateAssetTags, this.assetTamplateDetail.id).subscribe((res) => {
      this.showLoaderImage = false;
      // Success response
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    },
      (error: any) => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    );
  }
  setAssetTagDiscreteState(gatewayIoTag: any) {
    let setAssetGatewayIoTagDiscrete: AssetGatewayIoTagDiscreteState[] = [];
    let setAssetGatewayIoTagDiscrete2: AssetGatewayIoTagDiscreteState[] = [];
    let setAssetTagDiscreteStates: AssetTagDiscreteState[] = [];
    let assetTagDiscreteState: AssetTagDiscreteState = new AssetTagDiscreteState();
    assetTagDiscreteState.name = "state1";
    assetTagDiscreteState.numericValue = 1;
    if (gatewayIoTag.tagIOMode === "I") {
      assetTagDiscreteState.isCommandable = false;
    }
    if (gatewayIoTag.tagIOMode === "O") {
      assetTagDiscreteState.isCommandable = true;
    }
    assetTagDiscreteState.status = 'Active';
    let state1 = this.assetGatewayIoTagDiscreteState(gatewayIoTag, assetTagDiscreteState);
    setAssetGatewayIoTagDiscrete.push(state1);
    assetTagDiscreteState.assetGatewayIoTagDiscrete = setAssetGatewayIoTagDiscrete;
    setAssetTagDiscreteStates.push(assetTagDiscreteState);
    let assetTagDiscreteState2: AssetTagDiscreteState = new AssetTagDiscreteState();
    assetTagDiscreteState2.name = "state2";
    assetTagDiscreteState2.numericValue = 0;
    if (gatewayIoTag.tagIOMode === "I") {
      assetTagDiscreteState2.isCommandable = false;
    }
    if (gatewayIoTag.tagIOMode === "O") {
      assetTagDiscreteState2.isCommandable = true;
    }
    assetTagDiscreteState2.status = 'Active';
    let state2 = this.assetGatewayIoTagDiscreteState(gatewayIoTag, assetTagDiscreteState2);
    setAssetGatewayIoTagDiscrete2.push(state2);
    assetTagDiscreteState2.assetGatewayIoTagDiscrete = setAssetGatewayIoTagDiscrete2;
    setAssetTagDiscreteStates.push(assetTagDiscreteState2);
    return setAssetTagDiscreteStates;
  }
  assetGatewayIoTagDiscreteState(gatewayIoTag: any, assetTagDiscreteState: AssetTagDiscreteState) {
   // let setAssetGatewayIoTagDiscrete: AssetGatewayIoTagDiscreteState[]= [];
    let assetGatewayIoTagDiscrete: AssetGatewayIoTagDiscreteState = new AssetGatewayIoTagDiscreteState();
    assetGatewayIoTagDiscrete.gatewayIOTagId = gatewayIoTag.id;
    if (assetTagDiscreteState.name === "state1") {
      assetGatewayIoTagDiscrete.gatewayIoTagValue = 1;
    }
    if (assetTagDiscreteState.name === "state2") {
      assetGatewayIoTagDiscrete.gatewayIoTagValue = 0;
    }
    // setAssetGatewayIoTagDiscrete.push(assetGatewayIoTagDiscrete);
    return assetGatewayIoTagDiscrete;
  }
  setAssetGatewayIoTagAnalog(gatewayIoTag: any) {
    let setAssetGatewayIoTagAnalog: AssetGatewayIoTagAnalog[] = [];
    let assetGatewayIoTagAnalog: AssetGatewayIoTagAnalog = new AssetGatewayIoTagAnalog();
    assetGatewayIoTagAnalog.gatewayIOTagId = gatewayIoTag.id;
    assetGatewayIoTagAnalog.isScalingEnabled = false;
    assetGatewayIoTagAnalog.isClampToEuRangeValue = false;
    setAssetGatewayIoTagAnalog.push(assetGatewayIoTagAnalog);
    return setAssetGatewayIoTagAnalog;
  }

  // If success response click okay
  redirectTo() {
    this.navigateTemplate.emit('templateList');
    let manageAssetListView = document.getElementById('manageAssetListView');
    manageAssetListView.click();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === numRows)
      this.checkBoxToolTip = "Deselect All";
    else
      this.checkBoxToolTip = "Select All";
    if (numSelected > 0) {
      this._confirmed = true;
    }
    else {
      this._confirmed = false;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: GatewayIOTag): string {
    if (!row) {
      let row = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      return row;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  // This method used to update checkbox status when it's loaded into the view
  updateCheckboxStatus(nodes) {
    let checkedNodes = nodes.filter((e) => e.isAssigned);
    this.selection = new SelectionModel(true, checkedNodes);
  }

  backToAssetTemplate() {
    this.navigateTemplate.emit('templateList');
    let myTab = document.getElementById('manageAssetListView');
    myTab.click();
  }
  getEnggUnits() {
    this.assetTempalateServices.getEnggUnits().subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.engUnits = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }
  getStandardTagsByBId(organizationId: string) {
    this.assetTagService.getStandardTagsByBId(Number(organizationId)).subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.assetStandardTags = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  patchFormArrayData(assetStandardEntity): FormArray {
    const formArray = new FormArray([]);
    if (assetStandardEntity != null && assetStandardEntity.length !== 0) {
      assetStandardEntity.forEach(element => {
          formArray.push(this.formBuilder.group({
            standardTag: [''],
            generateTags: [''],
            order: ['']
          }))
      })
    }
    return formArray;
  }

  enggUnitChange(i, element, enggUnitId) {
    this.gatewayIOTagList[i].engUnitId = +enggUnitId;
  }


  standardTagChange(i, element, assetStandardTagId) {
    this.gatewayIOTagList[i].assetStandardTagId = +assetStandardTagId;
  }

}
