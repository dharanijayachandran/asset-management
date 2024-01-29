import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { AssetService } from 'src/app/asset/services/asset/asset.service';
import { GatewayTemplateService } from 'src/app/asset/services/gatewayTemplate/gateway-template.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetCategory } from '../../model/assetCategory';
import { AssetParameters } from '../../model/assetParameters';
import { AssetTemplate } from '../../model/assetTemplate';
import { AssetType } from '../../model/AssetType';
import { EngUnit } from '../../model/engUnit';
import { GeospatialObectType } from '../../model/GeospatialObectType';
import { RtDataSharingTopic } from '../../model/RtDataSharingTopic';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { AssetTemplateService } from '../../services/assetTemplate/asset-template.service';
@Component({
  selector: 'app-asset-template-form-view',
  templateUrl: './asset-template-form-view.component.html',
  styleUrls: ['./asset-template-form-view.component.css']
})
export class AssetTemplateFormViewComponent implements OnInit, OnDestroy {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  AssetTemplateForm: FormGroup;
  assetCategory: AssetCategory[] = [];
  assetTypes: AssetType[] = [];
  gatewayTemplate: any[] = [];
  assetTemplateId: number;
  addEditText: string;
  private assetTemplate: AssetTemplate = new AssetTemplate();
  assetParameters: AssetParameters[] = [];
  displayedColumns: string[] = ['name', 'description', 'value', 'engUnit', 'action'];
  restData: any;
  warningFlag: string;
  dataSource = new MatTableDataSource();
  engUnits: EngUnit[];
  index: any;
  parameter: any;
  isGPSTracingEnabled: boolean;
  geospatialObjectTypes: GeospatialObectType[];
  enableGeospatialObjectType: boolean;
  assetTypeByCategorys: any[] = [];
  rtDataSharingTopics: RtDataSharingTopic[] = [];
  rtDataSharingTopic: any;
  timeZoneList: any;
  public timeZoneData: { [key: string]: Object; }[] = [];
  public fields: Object = {
  text: 'name',
  value:'id'};
  public gatewayTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public assetCategoryFields: Object = {
    text: 'name',
    value: 'id'
  };
  public assetTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTemplate);
  }
  public onFilteringAssetCategory: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetCategory);
  }
  public onFilteringAssetType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetTypeByCategorys);
  }
  assetTypeByCategoryMap: Map<number, any[]>;
  assetCategoryIdForDropdownChange: number;
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown: string = 'Ascending';
  assetCategoryId: any;
  typeId: any;
  gateWayTemplateId: any;
  timeZoneId:any;
  // set the placeholder to DropDownList input element
  public watermark: any = '--Select--';
  public gatewayTemplateWaterMark: string = 'Select Gateway Template';
  public assetCategoryWaterMark: string = 'Select Asset Category';
  public assetTypeWaterMark: string = 'Select Asset Type';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;

  constructor(private route: Router, private formBuilder: FormBuilder,
    private globalService: globalSharedService,
    private assetTemplateListService: AssetTemplateService, private gatewayTemplateService: GatewayTemplateService, private assetService: AssetService, private assetSharedService: AssetSharedService) {
    this.assetForm();
  }

  assetForm() {
    this.AssetTemplateForm = this.formBuilder.group({
      id: [null],
      name: [null, [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      typeId: [null],
      assetTypeName: null,
      assetCategoryId: [null, Validators.required],
      assetCategoryName: null,
      description: [null],
      gateWayTemplateId: [null],
      gatewayTemplateName: null,
      status: ['Active'],
      isGPSTrackingEnabled: [false],
      geospatialObjectType: [1],
      assetParams: this.formBuilder.array([]),
      isRtDataSharingEnabled: [false],
      rtDataSharingTopic: [null],
      timeZoneId:[null]
    })
  }

  addAssetParameter(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      value: [null],
      description: [null],
      engUnitId: [null],
      assetId: [null],
      status: ['Active'],
    });
  }


  ngOnInit() {
    this.assetTypeByCategoryMap= this.globalService.assetTypeByCategoryMap;
    this.getTimeZoneList();
    this.getAssetTypes();
    this.getAssetCategoryList();
    this.getGatewayTemplates();
    this.getEngUnits();
    this.getGeospatialObjectTypes();
    this.locale = this.globalService.getLanguage();
    this.rtDataSharingTopics = this.globalService.rtDataSharingTopics;
    // Checking whether clicked new assetTemplate and edit assetTemplate
    this.assetTemplateId = this.globalService.selectedId;
    if (this.assetTemplateId == null || this.assetTemplateId == undefined) {
      this.addEditText = "Add";
      if (this.globalService.listOfRow.hasOwnProperty('name')) {
        this.globalService.listOfRow.id = null;
        this.editAssetTemplate(this.globalService.listOfRow);
      } else {
      }
    } else if (this.assetTemplateId != null) {
      this.addEditText = "Edit";
      this.restData = this.globalService.listOfRow;
      this.editAssetTemplate(this.globalService.listOfRow);
    }
  }
  ngOnDestroy() {
  }
  addRow(): void {
    const control = <FormArray>this.AssetTemplateForm.controls['assetParams'];
    let data = this.dataSource.data;
    if (data != null && data.length !== 0) {
      control.push(this.addAssetParameter());
      data.push(control);
      this.dataSource.data = data;
    } else {
      data = [];
      control.push(this.addAssetParameter());
      data.push(control);
      this.dataSource.data = data;
    }
  }
  // assetTemplate bind to View
  editAssetTemplate(assetTemplate) {
    this.assetCategoryIdForDropdownChange = this.globalService.listOfRow.assetCategoryId;
    this.AssetTemplateForm.patchValue({
      id: assetTemplate.id,
      name: assetTemplate.name,
      description: assetTemplate.description,
      typeId: assetTemplate.typeId,
      assetTypeName:assetTemplate.assetTypeName,
      assetCategoryId: assetTemplate.assetCategoryId,
      assetCategoryName: assetTemplate.assetCategoryName,
      gateWayTemplateId: assetTemplate.gateWayTemplateId,
      isGPSTrackingEnabled: assetTemplate.isGPSTrackingEnabled,
      geospatialObjectType: assetTemplate.geospatialObjectType,
      status: assetTemplate.status,
      isRtDataSharingEnabled: assetTemplate.isRtDataSharingEnabled,
      rtDataSharingTopic: assetTemplate.rtDataSharingTopic,
      timeZoneId:assetTemplate.timeZoneId
    });
    if (this.AssetTemplateForm.controls['isGPSTrackingEnabled'].value) {
      this.enableGeospatialObjectType = true;
    }
    this.assetParameters = assetTemplate.assetParams;
    if (this.assetParameters) {
      this.AssetTemplateForm.setControl('assetParams', this.patchFormArray());
    }
  }

  setGatewayTemplateName(gatewayTemplateId) {
    let gatewayTemplateName;
    if (this.gatewayTemplate) {
      for (let e of this.gatewayTemplate) {
        if (e.id == gatewayTemplateId) {
          gatewayTemplateName = e.name;
          break;
        }
      }
      return gatewayTemplateName;
    }
  }
  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
  cancelForm(event) {
    if (this.AssetTemplateForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelConfirm();
    }
  }

  @Output() navigateTemplate = new EventEmitter();
  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.listOfRow = [];
    this.AssetTemplateForm.reset();
    this.navigateTemplate.emit('templateList');
  }

  // Reset form
  resetForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.assetTemplate = <AssetTemplate>this.AssetTemplateForm.value;
    if (this.assetTemplate.id === null) {
      this.assetForm();
      this.dataSource.data = [];
    }
    else {
      //this.registerAssetForm();
      this.assetForm();
      this.editAssetTemplate(this.restData);
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
  // preview assetTemplate
  previewMode() {
    this.globalService.listOfRow = null;
    this.assetTemplate = <AssetTemplate>this.AssetTemplateForm.value;
    if (this.assetTemplate.assetTypeName == "--Select--") {
      this.assetTemplate.assetTypeName = null;
    }
    if(this.assetTemplate.timeZoneId == null){
      this.assetTemplate.timeZoneId = this.watermark;
    }
    if (!this.assetTemplate.gatewayTemplateName) {
      this.assetTemplate.gatewayTemplateName = this.setGatewayTemplateName(this.assetTemplate.gateWayTemplateId);
    }
    let userId = sessionStorage.getItem("userId");
    if (this.assetTemplate.assetParams) {
      this.assetTemplate.assetParams.forEach(param => {
        if (this.assetParameters) {
          this.assetParameters = this.assetParameters.filter(dbParam => dbParam.id != param.id);
        }
      })
      if (this.assetParameters) {
        this.assetParameters.forEach(param => {
          this.assetTemplate.assetParams.push(param)
        })
      }
      this.assetTemplate.assetParams.forEach(param => {
        this.engUnits.forEach(unit => {
          if (unit.id == param.engUnitId) {
            param.engUnitName = unit.name
          }
        })
        if (null != param.id) {
          param.updatedBy = parseInt(userId);
        } else {
          param.createdBy = parseInt(userId);
        }
      })
    }
    if (!this.assetTemplate.geospatialObjectTypeName) {
      this.assetTemplate.geospatialObjectTypeName = this.setGeospatialObjectTypeName(this.assetTemplate.geospatialObjectType);
    }
    this.globalService.listOfRow = this.assetTemplate;
    this.navigateTemplate.emit('templatePreview');
  }
  setGeospatialObjectTypeName(geospatialObjectType: number): string {
    let geospatialObjectTypeName;
    if (this.geospatialObjectTypes) {
      for (let e of this.geospatialObjectTypes) {
        if (e.id == geospatialObjectType) {
          geospatialObjectTypeName = e.name;
          break;
        }
      }
      return geospatialObjectTypeName;
    }
  }
  getAssetTemplateDetailById(id) {
  }
  assetCategoryChange($event) {
    delete this.assetTypeByCategorys;
    this.AssetTemplateForm.controls['assetCategoryName'].setValue($event.itemData.name);
    let assetCategoryId = +$event.itemData.id;
    this.getAssetTypeByCategoryId(assetCategoryId);
  }
  getAssetTypeByCategoryId(assetCategoryId: number) {
    this.assetTypeByCategorys = [];
    if(this.assetTypeByCategoryMap.has(assetCategoryId) && Array.isArray(this.assetTypeByCategorys) && this.assetTypeByCategorys.length){
      this.assetTypeByCategorys=this.assetTypeByCategoryMap.get(assetCategoryId);
    }else{
      this.assetTypeByCategorys = [];
      this.assetTypes = this.assetSharedService.assetTypes;
      this.assetTypes = this.assetSharedService.assetTypes;
      this.assetTypeByCategorys = this.assetTypes.filter(element => element.assetCategoryId == assetCategoryId)
    }
    if (assetCategoryId != this.assetCategoryIdForDropdownChange) {
      this.AssetTemplateForm.controls['assetTypeName'].setValue("");
      this.AssetTemplateForm.controls['typeId'].setValue(null);
      this.assetCategoryIdForDropdownChange = assetCategoryId;
    }
    if(this.assetTypeByCategorys.length){
      this.assetTypeByCategorys = this.globalService.addSelectIntoList(this.assetTypeByCategorys);
    }
  }
  // assetTypeChange
  assetTypeChange($event) {
    if($event.value){
      this.AssetTemplateForm.controls['assetTypeName'].setValue($event.itemData.name);
    }else{
      this.AssetTemplateForm.controls['assetTypeName'].setValue("");
      this.AssetTemplateForm.controls['typeId'].setValue(null);
    }
  }

  //
  gatewayTemplateChange($event) {
    if ($event.value) {
      this.AssetTemplateForm.controls['gatewayTemplateName'].setValue($event.itemData.name);
    } else {
      this.AssetTemplateForm.controls['gatewayTemplateName'].setValue("");
      this.AssetTemplateForm.controls['gateWayTemplateId'].setValue(null);
    }

  }

  // Get all Asset Type List
  getAssetTypes() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetService.getAccessTypeByOrganizationId(Number(organizationId)).subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.assetTypes = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }
  // Get all Gateway Template List
  getGatewayTemplates() {
    let beId = sessionStorage.getItem('beId');
    this.gatewayTemplateService.getGatewayTemplatesList(beId)
      .subscribe(
        res => {
          this.gatewayTemplate = res;
          this.gatewayTemplate = this.globalService.addSelectIntoList(this.gatewayTemplate);
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.AssetTemplateForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  deleteAssetParameter(parameter, index) {
    this.index = index;
    this.parameter = parameter;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Parameter!');

  }

  confirmDelete() {
    const control = <FormArray>this.AssetTemplateForm.controls['assetParams'];
    control.removeAt(this.index)
    if (this.parameter.id != null) {
      this.assetParameters.forEach(param => {
        if (this.parameter.id == param.id) {
          param.status = 'Deleted'
        }
      })
    }
    let temp = this.dataSource.data
    temp.splice(this.index, 1);
    this.dataSource.data = [];
    this.dataSource.data = temp;
  }

  patchFormArray(): FormArray {
    const formArray = new FormArray([]);
    if (this.assetParameters != null && this.assetParameters.length != 0) {
      this.assetParameters.forEach(param => {
        if (param.status != null && param.status != 'Deleted') {
          this.dataSource.data.push(param)
          formArray.push(this.formBuilder.group({
            id: [param.id],
            name: [param.name, [Validators.required]],
            value: [param.value],
            description: [param.description],
            engUnitId: [param.engUnitId],
            assetId: [param.assetId],
            status: [param.status],
          }))
        }
      })
    }
    return formArray;
  }
  refreshTableListFunction() {
  }

  getEngUnits() {
    this.assetTemplateListService.getEnggUnits().subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.engUnits = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  //Get getGeospatialObjectTypes
  getGeospatialObjectTypes() {
    this.assetTemplateListService.getGeospatialObjectTypes().subscribe(data => {
      this.geospatialObjectTypes = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  isGPSTracingEnabledCheckBox(checkbox: MatCheckbox) {
    if (!checkbox.checked) {
      this.AssetTemplateForm.controls.geospatialObjectType.setValue(1);
      this.enableGeospatialObjectType = true;
    } else {
      this.enableGeospatialObjectType = false;
    }
  }

  // Get all Asset Category List
  getAssetCategoryList() {
    this.assetTemplateListService.getAssetCategoryList().subscribe(
      res => {
        this.assetCategory = res;
        // this.assetSharedService.setAssetCategoryDetails(this.assetCategory);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        //
      });
  }

  public rtDataSharingTopicWaterMark: string = 'Select Real Time Data Sharing Topic';
  public rtDataSharingTopicFields: Object = {
    text: 'name',
  };
  public onFilteringRtDataSharingTopic: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.rtDataSharingTopics);
  }

  RtDataSharingENableChange(event) {
    if (!event.checked) {
      this.AssetTemplateForm.controls['rtDataSharingTopic'].setValue(null);
      this.AssetTemplateForm.controls['rtDataSharingTopic'].clearValidators();
      this.AssetTemplateForm.controls['rtDataSharingTopic'].updateValueAndValidity();
      this.AssetTemplateForm.controls['rtDataSharingTopic'].setErrors(null)
    }
    else {
      this.AssetTemplateForm.controls['rtDataSharingTopic'].markAsTouched();
      this.AssetTemplateForm.controls['rtDataSharingTopic'].updateValueAndValidity();
      this.AssetTemplateForm.controls['rtDataSharingTopic'].setErrors({
        'required': true
      });
    }
  }
  getTimeZoneList() {
    this.assetTemplateListService.getTimeZoneList().subscribe(res => {
        this.timeZoneList = res;
        this.timeZoneData=this.getFormattedUsersList(this.timeZoneList);
        this.timeZoneFilter();
        },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  timeZoneFilter() {
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(null == this.AssetTemplateForm.value.timeZoneId){
      this.timeZoneData.forEach(data=>{
        if(data.name == targetTimeZone){
         this.watermark = data.name;
         this.AssetTemplateForm.controls['timeZoneId'].setValue(data.id);
        }
      })
    }else{
      this.watermark = this.AssetTemplateForm.value.timeZoneId;
    }
  }
  timeZoneOnChange(event) {
    if(event.itemData.name){
      this.globalService.listOfRow.timeZoneId = event.itemData.name;
      this.AssetTemplateForm.controls['timeZoneId'].setValue(event.itemData.name);
    }
}
getFormattedUsersList(data){
  const that = this;
  return data.map(function (l) {
    return {
      name: l.name,
      id: l.id,
    };
  });
}
}
