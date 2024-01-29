import { Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService, UIModalNotificationPage } from 'global';
import { Observable } from 'rxjs';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetTag } from '../../model/assetTag';
import { AssetTagDiscreteState } from '../../model/assetTagDiscrete';
import { DiscreteState } from '../../model/discreteState';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { DiscreteTagService } from '../../services/discreteTag/discrete-tag.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { AssetStandardTag } from '../../model/AssetStandardTag';

@Component({
  selector: 'app-discrete-tag-form',
  templateUrl: './discrete-tag-form.component.html',
  styleUrls: ['./discrete-tag-form.component.css']
})
export class DiscreteTagFormComponent implements OnInit {
  assetTagDiscreteStateobject: AssetTagDiscreteState;
  index: number;
  isNumericValueDuplicate: boolean;

  // It help to if there are no pending changes, just allow deactivation; else confirm first code starts here
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.discreteForm.dirty) {
      this.dialogService.alertMessage('Warning', 'You will not be able to recover the changes!');
      // returning false will show a confirm dialog before navigating away
    } else {
      return true; // returning true will navigate without confirmation
    }
    return this.dialogService.navigateAwaySelection$;
  }
  // It help to if there are no pending changes, just allow deactivation; else confirm first code ends here


  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  dataTypeList: any;
  discreteForm: FormGroup;
  dataSource = new MatTableDataSource();
  discreteState: DiscreteState[] = [];
  assetTagDiscreteStateList: AssetTagDiscreteState[] = [];
  assetTagDiscret: AssetTagDiscreteState
  // displayedColumns: string[] = ['id', 'sNo', 'assetTagState', 'commandable', 'standardState'];
  displayedColumns: string[] = ['sNo', 'assetTagState', 'numericValue', 'commandable', 'standardState', 'status', 'action'];
  commandableList: Boolean[] = [true, false];
  assetTagDiscreteStateobj: AssetTag;
  orgAssetStandardTagId:any;
  @Output() navigateTemplate = new EventEmitter();
  assetTemplateDetail: any;
  assetDiscreteId: any;
  warningFlag: string;
  assetTagRemovedObjects: AssetTagDiscreteState[] = [];
  assetStandardTagList: AssetStandardTag[] = [];
  orgAssetStandardTagName:any;
  public dataTypeFields: Object = {
    text: 'name',
    value: 'id'
  };

  public assetStandardTagFields: Object = {
    text: 'name',
    value: 'id'
  };

  public onFilteringDataType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.dataTypeList);
  }

  public onFilteringAssetStandardTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.assetStandardTagList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown:string ='Ascending';
  dataTypeId:any;

  // set the placeholder to DropDownList input element

  public dataTypeWaterMark: string = 'Select Data Type';
  public assetStandardTagMark: string = 'Select Organization Standard Tag';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;


  constructor(private formBuilder: FormBuilder, private discreteTagService: DiscreteTagService, private assetSharedService: AssetSharedService, private globalService: globalSharedService, private dialogService: DialogService) {
    this.loadDiscreteForm();
  }

  ngOnInit() {
    this.discreteStates();
    this.dataTypeIdList();
    this.getAssetStandardTagList();
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.assetDiscreteId = this.assetSharedService.selectedId;
    if (this.assetDiscreteId == null || this.assetDiscreteId == undefined) {
      if (this.assetSharedService.analogAssetObj.hasOwnProperty('name')) {
        // this.globalService.listOfRow.id = null;
        this.editDiscreteAssetTag(this.assetSharedService.analogAssetObj);
      }
    } else if (this.assetDiscreteId != null) {
      this.editDiscreteAssetTag(this.assetSharedService.analogAssetObj);
    }
  }

  loadDiscreteForm() {
    this.discreteForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      description: [''],
      dataTypeId: [null, [Validators.required]],
      status: ['Active'],
      assetTagDiscreteState: this.formBuilder.array([this.createRow()]),
      orgAssetStandardTagId:[null],
      orgAssetStandardTagName:'',
      displayOrder:[,[Validators.pattern("[0-9]")]]
    })
  }
  createRow(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: '',
      numericValue: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      isCommandable: [null, [Validators.required]],
      discreteStateId: [null],
      status: ['Active'],
    });
  }
  addRow(): void {
    const control = <FormArray>this.discreteForm.controls['assetTagDiscreteState'];
    let data = this.dataSource.data;
    if (data != null && data.length !== 0) {
      control.push(this.createRow());
      data.push(control);
      this.dataSource.data = data;
    } else {
      data = [];
      if (control.length == 0) {
        control.push(this.createRow());
      }
      data.push(control);
      this.dataSource.data = data;
    }
  }
  editDiscreteAssetTag(discreteAssetTagObj: AssetTag) {
    if (discreteAssetTagObj != undefined && discreteAssetTagObj != null) {
      this.assetTagDiscreteStateList = discreteAssetTagObj.assetTagDiscreteState;
      this.discreteForm.patchValue({
        orgAssetStandardTagId: discreteAssetTagObj.orgAssetStandardTagId,
        id: discreteAssetTagObj.id,
        name: discreteAssetTagObj.name,
        description: discreteAssetTagObj.description,
        dataTypeId: discreteAssetTagObj.dataTypeId,
        orgAssetStandardTagName:discreteAssetTagObj.orgAssetStandardTagName,
        status: discreteAssetTagObj.status,
        assetTagDiscreteState: this.assetTagDiscreteStates()
      });
    }
  }
  patchFormArrayData(): FormArray {
    const formArray = new FormArray([]);
    if (this.assetTagDiscreteStateList !== null && this.assetTagDiscreteStateList.length !== 0) {
      this.assetTagDiscreteStateList.forEach(element => {
        if (element !== null) {
          formArray.push(this.formBuilder.group({
            id: element.id,
            name: element.name,
            numericValue: [element.numericValue, [Validators.required, Validators.pattern("^[0-9]*$")]],
            isCommandable: [element.isCommandable, [Validators.required]],
            discreteStateId: element.discreteStateId,
            status: element.status,
          }))
        } else {
          formArray.push(this.formBuilder.group({
            id: [null],
            name: '',
            numericValue: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
            isCommandable: [null, [Validators.required]],
            discreteStateId: [null],
            status: ['Active'],
          }))
        }
      })
    }
    return formArray
  }
  discreteStates() {
   // this.discreteState = this.assetSharedService.discreteState;
    this.discreteTagService.discreteStates().subscribe(
      res => {
        this.discreteState = res;
        this.assetSharedService.setAssetDiscreteStateDetails(this.discreteState);
      },
      error => {
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  assetTagDiscreteStates() {
    if (this.assetTagDiscreteStateList !== null && this.assetTagDiscreteStateList.length !== 0) {
      this.assetTagDiscreteStateList.forEach(element => {
        if (element.status == 'Deleted') {
          this.assetTagRemovedObjects.push(element);
          let idx = this.assetTagDiscreteStateList.indexOf(element);
          this.assetTagDiscreteStateList.splice(idx, 1);

        }
      });
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.assetTagDiscreteStateList;
      this.discreteForm.setControl('assetTagDiscreteState', this.patchFormArrayData());
    }
    else {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = [];
    }

  }

  // preview assetTemplate
  previewMode() {
    this.assetTagDiscreteStateobj = <AssetTag>this.discreteForm.value;
    let assetDiscreteTag = this.assetSharedService.analogAssetObj;
    //this.assetTagDiscreteStateobj.dataTypeId = assetDiscreteTag.dataTypeId;
    if (assetDiscreteTag.engUnitId != null) {
      this.assetTagDiscreteStateobj.engUnitId = assetDiscreteTag.engUnitId;
    }
    else {
      this.assetTagDiscreteStateobj.engUnitId = null;
    }
    this.assetTagDiscreteStateobj.isInputEnabled = assetDiscreteTag.isInputEnabled;
    this.assetTagDiscreteStateobj.isOutputEnabled = assetDiscreteTag.isOutputEnabled;
    this.assetTagDiscreteStateobj.tagType = assetDiscreteTag.tagType
    if (this.assetTagRemovedObjects != undefined && this.assetTagRemovedObjects != null) {
      this.assetTagRemovedObjects.forEach(e => {
        this.assetTagDiscreteStateobj.assetTagDiscreteState.push(e);
      })
    }
    // this.assetTagDiscreteStateobj.assetId = this.assetTemplateDetail.id;
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
    this.assetSharedService.analogAssetObj = this.assetTagDiscreteStateobj;
    this.isNumericValueDuplicate = false;

    if (this.assetTagDiscreteStateobj.assetTagDiscreteState.length > 1) {
      for (let i = 0; i < this.assetTagDiscreteStateobj.assetTagDiscreteState.length-1; i++) {
        for (let j = i+1; j < this.assetTagDiscreteStateobj.assetTagDiscreteState.length; j++) {
          if (this.assetTagDiscreteStateobj.assetTagDiscreteState[i].numericValue == this.assetTagDiscreteStateobj.assetTagDiscreteState[j].numericValue) {
            this.isNumericValueDuplicate = true;
            break;
          }
          else {
            this.isNumericValueDuplicate = false;
            this.navigateTemplate.emit('discreteTagPreview');
          }
        }
      }
    }
  }
  // Cancel DiscreteForm the form
  cancelDiscreteForm(event) {
    if (this.discreteForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  // For tab navigate
  @Output() tabName = new EventEmitter();
  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.GettingString('manageTags');
    this.globalService.setOrganizationDetail("", this.assetTemplateDetail);;
    this.navigateTemplate.emit('discreteTagList');
    this.tabName.emit(true);

  }
  refreshTableListFunction() {
    this.loadDiscreteForm();
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.assetDiscreteId = this.assetSharedService.selectedId;
    this.discreteStates();
  }
  resetdiscreteForm() {
    if (this.discreteForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  // Form reset  confirm
  formResetConfirm() {
    if (this.assetDiscreteId != null) {
      this.editDiscreteAssetTag(this.assetSharedService.analogAssetObj);
    } else {
      this.loadDiscreteForm();
    }
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    this.warningFlag = "";
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.discreteForm.get('name').setErrors({
        pattern: true
      });
    }
  }
  // To get all data Type list for drop down
  dataTypeIdList() {
    this.dataTypeList = this.assetSharedService.dataTypeList;
  }
  get assetTagDiscreteState(): FormArray {
    return this.discreteForm.get('assetTagDiscreteState') as FormArray;
  }
  getAssetStandardTagList() {
    this.assetStandardTagList = this.assetSharedService.assetStandardTagList;
  }

  deleteDiscreteAssetTagState(assetTagDiscreteStateobject, index) {
    this.assetTagDiscreteStateobject = null;
    // this.index = 0;
    if (this.assetTagDiscreteStateobject == null && this.assetTagDiscreteStateobject == undefined) {
      this.assetTagDiscreteStateobject = assetTagDiscreteStateobject;
      this.index = index;
    }
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Tag Discrete State!');

  }
  formatDiscreteAssetTagObj(assetStateDiscreteStateobj) {

    let Obj: AssetTagDiscreteState = new AssetTagDiscreteState();
    Obj.id = assetStateDiscreteStateobj.id,
      Obj.name = assetStateDiscreteStateobj.name,
      Obj.numericValue = assetStateDiscreteStateobj.numericValue,
      Obj.isCommandable = assetStateDiscreteStateobj.isCommandable,
      Obj.discreteStateId = assetStateDiscreteStateobj.discreteStateId,
      Obj.status = assetStateDiscreteStateobj.status
    return Obj;
  }

  confirmDelete() {
    const control = <FormArray>this.discreteForm.controls['assetTagDiscreteState'];
    control.removeAt(this.index)
    if (this.assetTagDiscreteStateobject != undefined && this.assetTagDiscreteStateobject != null) {
      if (this.assetTagDiscreteStateobject.id != null) {
        this.assetTagDiscreteStateList.forEach(assetStateDiscreteStateobj => {
          if (this.assetTagDiscreteStateobject.id == assetStateDiscreteStateobj.id) {
            assetStateDiscreteStateobj.status = 'Deleted'
            let obj = this.formatDiscreteAssetTagObj(assetStateDiscreteStateobj);
            this.assetTagRemovedObjects.push(obj);
          }
        })
      }
    }
    let temp = this.dataSource.data
    temp.splice(this.index, 1);
    this.dataSource.data = [];
    this.dataSource.data = temp;
  }

  dataTypeChange($event) {
    this.discreteForm.controls['dataTypeId'].setValue($event.itemData.id);
    let dataTypeId = this.discreteForm.controls['dataTypeId'].value;
    if (dataTypeId == null) {
      // this.analogForm.controls['dataTypeName'].setValue([]);
    } else {
      this.discreteForm.controls['dataTypeName'].setValue($event.itemData.name);
    }
  }

  assetStandardTagChange($event) {
    if($event.value){
      this.discreteForm.controls['orgAssetStandardTagId'].setValue($event.itemData.id);
      let dataTypeId = this.discreteForm.controls['orgAssetStandardTagId'].value;
      if (dataTypeId == null) {
        this.discreteForm.controls['orgAssetStandardTagName'].setValue('');
      } else {
        this.discreteForm.controls['orgAssetStandardTagName'].setValue($event.itemData.name);
      }
    }else{
      this.discreteForm.controls['orgAssetStandardTagId'].setValue(null);
      this.discreteForm.controls['orgAssetStandardTagName'].setValue('');
    }
  }

}
