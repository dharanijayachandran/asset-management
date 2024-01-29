import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService, PendingChangesGuard, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayTemplate } from 'src/app/shared/model/gatewayTemplate';
import { AssetCategory } from '../../../asset-template/model/assetCategory';
import { AssetParameters } from '../../../asset-template/model/assetParameters';
import { AssetTemplate } from '../../../asset-template/model/assetTemplate';
import { EngUnit } from '../../../asset-template/model/engUnit';
import { AssetSharedService } from '../../../asset-template/services/asset-shared-service/asset-shared.service';
import { AssetTemplateService } from '../../../asset-template/services/assetTemplate/asset-template.service';
import { GatewayTemplateService } from '../../services/gatewayTemplate/gateway-template.service';
import { AssetService } from '../../services/asset/asset.service';
import { AssetType } from 'src/app/asset-template/model/AssetType';
import { MatCheckbox } from '@angular/material/checkbox';
import { GeospatialObectType } from 'src/app/asset-template/model/GeospatialObectType';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';
import { RtDataSharingTopic } from 'src/app/asset-template/model/RtDataSharingTopic';
@Component({
  selector: 'app-asset-form-view',
  templateUrl: './asset-form-view.component.html',
  styleUrls: ['./asset-form-view.component.css']
})
export class AssetFormViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  AssetForm: FormGroup;
  assetTypes: AssetType[] = [];
  assetTemplate: AssetTemplate[] = [];
  gatewayTemplate: GatewayTemplate[] = [];
  editable = false;
  private asset: AssetTemplate = new AssetTemplate();
  parentObj: any;
  assetId: any;
  fetchParentButton = false;
  displayPage: string;
  warningFlag: string;
  assetDetails: any;
  FetchparentToolTip = "Fetch Parent"
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = ['name', 'description', 'value', 'engUnit', 'action'];
  assetParameters: AssetParameters[] = [];
  engUnits: EngUnit[];
  index: any;
  parameter: any;
  enableGeospatialObjectType: boolean;
  geospatialObjectTypes: GeospatialObectType[];
  isGPSTracingEnabled: boolean;
  splitedCoordinates: any;
  splitedGeospatialCoordinates: any;
  heading: string;
  messageFormat: string;
  assetCategory: AssetCategory[];
  assetTypeByCategorys: any[] = [];
  rtDataSharingTopics: RtDataSharingTopic[] = [];
  public gatewayTemplateFields: Object = {
    text: 'name',
    value: 'id'
  };
  public assetTemplateFields: Object = {
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
  public fields: Object = {
    text: 'name',
    value:'id'};
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringGatewayTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.gatewayTemplate);
  }
  public onFilteringAssetTemplates: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetTemplate);
  }
  public onFilteringAssetCategory: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetCategory);
  }
  public onFilteringAssetType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetTypeByCategorys);
  }
  assetTypeByCategoryMap: Map<number, any[]>;
  parentAssetLoaderResetButton: boolean;
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown: string = 'Ascending';
  assetTemplateId: any;
  rtDataSharingTopic: any
  gateWayTemplateId: any;
  assetCategoryId: any;
  assetCategoryIdForDropdownChange: any;
  typeId: any;
  public watermark: string = '--Select--';
  public timeZoneData:any;
  public assetCategoryWaterMark: string = 'Select Asset Category';
  public assetTypeWaterMark: string = 'Select Asset Type';
  // set the placeholder to DropDownList input element

  public assetTemplateWaterMark: string = 'Select Asset Template';
  public gatewayTemplateWaterMark: string = 'Select Gateway';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;
  formatResponse:any;
  timeZoneId:any;
  constructor(private formBuilder: FormBuilder,
    private globalService: globalSharedService,
    private assetTemplateListService: AssetTemplateService, private gatewayTemplateService: GatewayTemplateService, private route: Router, private assetSharedService: AssetSharedService, private dialogService: DialogService, private pendingChangesGuard: PendingChangesGuard,
    private assetService: AssetService) { }

  ngOnInit() {
    this.assetTypeByCategoryMap = this.globalService.assetTypeByCategoryMap;
    this.getTimeZoneList();
    this.getAssetCategoryList();
    this.getAssetTypes();
    this.getEngUnits();
    this.getGeospatialObjectTypes();
    this.registerAssetForm();
    this.getAssetTemplateList();
    this.rtDataSharingTopics = this.globalService.rtDataSharingTopics;
    if (this.globalService.assetViewModeFormViewStatus == "addAssetViewMode") {
      if (this.globalService.assetDetails) {
        this.assetDetails = this.globalService.assetDetails
        this.showAsset(this.globalService.assetDetails)
      } else {
        this.registerAssetForm();
      }
    } else if (this.globalService.assetViewModeFormViewStatus == "editFormViewMode") {
      this.viewAsset();
    }
  }
  registerAssetForm() {
    this.AssetForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      assetTemplateId: [null
      ],
      assetTemplateName: '',
      assetCategoryId: [null, Validators.required],
      assetCategoryName: '',
      typeId: [null],
      assetTypeName: '',
      description: [''],
      gateWayTemplateId: [null],
      gatewayTemplateName: '',
      refAssetId: [],
      isTemplate: ['Template'],
      status: ['Active'],
      timeZoneId:[null],
      isGPSTrackingEnabled: [false],
      geospatialObjectType: [1],
      geospatialCoordinates: [null],
      assetParams: this.formBuilder.array([]),
      isRtDataSharingEnabled: [false],
      rtDataSharingTopic: [null],
      assetOrder: [null, Validators.pattern("[0-9]*")],
    })
  }

  addAssetParameter(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      value: [null],
      description: [null],
      engUnitId: [null],
      engUnitName:[null],
      assetId: [null],
      status: ['Active'],
    });
  }


  addRow(): void {
    const control = <FormArray>this.AssetForm.controls['assetParams'];
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

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  // cancel rorm
  cancelForm(event) {
    if (this.AssetForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    } else {
      this.formCancelCommon();
    }
  }

  @Output() navigateTemplate = new EventEmitter();
  // Asset form cancel common
  formCancelCommon() {
    this.globalService.setassetViewModeFormViewStatus('assetViewMode');
    // sessionStorage.setItem("assetView", "view");
    //this.globalService.listOfRow = [];
    this.AssetForm.reset();
    $('.e-list-parent li').removeClass('e-active');
    this.displayPage = '';
    this.navigateTemplate.emit('saveAsset');
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.formCancelCommon();
  }

  // Reset form
  resetForm() {
    this.warningFlag = "reset";
    this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
  }

  // Form reset  confirm
  formResetConfirm() {
    this.asset = <AssetTemplate>this.AssetForm.value;
    if (this.asset.id === null) {
      if (this.assetDetails) {
        this.showAsset(this.assetDetails);
        this.dataSource.data = [];
      } else {
        this.registerAssetForm();
      }
    }
    else {
      this.viewAsset();
    }
  }


  //temperary solution for sweet alert on same page for Confirmed(Cancel/Reset) scenario
  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.formCancelConfirm();
    }
    else if (this.warningFlag == "saveAsset") {
      this.saveAsset();
    }
    this.warningFlag = "";
  }


  // access type Change
  accessTypeChange($event) {
    this.AssetForm.controls['assetTypeName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
  }


  // Gateway option change set Gateway name
  // gateWayTemplateOptionChange($event) {
  //   this.AssetForm.controls['gatewayTemplateName'].setValue($event.target.options[$event.target.options.selectedIndex].text);
  // }

  // preview assetTemplate
  previewMode() {
    this.globalService.listOfRow = null;
    this.asset = <AssetTemplate>this.AssetForm.value;
    if(this.asset.timeZoneId == null){
      this.asset.timeZoneId = this.watermark;
    }
    if (!this.asset.geospatialObjectTypeName) {
      this.asset.geospatialObjectTypeName = this.setGeospatialObjectTypeName(this.asset.geospatialObjectType);
    }
    if (!this.asset.assetTypeName) {
      this.asset.assetTypeName = this.setAssetTypeName(this.asset.typeId);
    }
    if (this.asset.assetTemplateId == null && this.asset.gateWayTemplateId == null) {
      this.warningFlag = "saveAsset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'Asset Template and Gateway are not selected.Do You want to proceed?');
    }
    else {
      this.saveAsset();
    }
  }
  setAssetTypeName(typeId: number): string {
    for (let type of this.assetTypes) {
      if (typeId == type.id) {
        return type.name;
        break;
      }
    }
  }
  saveAsset() {
    if (this.parentObj != null || this.parentObj != undefined) {
      this.asset.refAssetId = this.parentObj.id;
    }
    let userId = sessionStorage.getItem("userId");
    if (this.asset.assetParams) {
      this.asset.assetParams.forEach(param => {
        if (this.assetParameters) {
          this.assetParameters = this.assetParameters.filter(dbParam => dbParam.id != param.id);
        }
      })
      if (this.assetParameters) {
        this.assetParameters.forEach(param => {
          this.asset.assetParams.push(param)
        })
      }
      this.asset.assetParams.forEach(param => {
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
    if (this.asset.assetTypeName == "--Select--") {
      this.asset.assetTypeName = null;
    }
    this.globalService.listOfRow = this.asset;
    this.navigateTemplate.emit('assetPreview');
  }

  // Getting Asset Template list and based on selected Asset option, get Gateway JSON.
  getAssetTemplateList() {
    // Get all Asset template List
    this.assetTemplate = this.assetSharedService.assetTemplate;
  }

  // Change the Asset Template option and
  // Based on Asset Template option getting all Gateway JSON and bind to HTML Gatway option
  // This code will execute when edit mode comes
  assetTemplateChange(assetTemplateId, isResetStateInfo) {
    if (assetTemplateId != 0) {
      if (this.globalService.assetViewModeFormViewStatus == "editFormViewMode") {
        this.AssetForm.controls["gateWayTemplateId"].setValue(null);
      }
      this.getAssetTemplateById(assetTemplateId);
      this.gatewayChangeByAssetTemplate(assetTemplateId, isResetStateInfo);
    } else {
      this.gatewayTemplate = [];
      this.AssetForm.controls["assetTemplateId"].setValue(null);
      this.AssetForm.controls["assetTemplateName"].setValue("");
      this.AssetForm.controls['gateWayTemplateId'].setValue(null);
      this.AssetForm.controls['gatewayTemplateName'].setValue("");
      this.AssetForm.controls["gateWayTemplateId"].clearValidators();
      this.AssetForm.controls["gateWayTemplateId"].updateValueAndValidity();
    }

  }
  getAssetTemplateById(assetTemplateId: any) {
    this.assetTemplate.forEach(assetTemplate => {
      if (assetTemplate.id === Number(assetTemplateId)) {
        this.AssetForm.controls['isGPSTrackingEnabled'].setValue(assetTemplate.isGPSTrackingEnabled);
        if (assetTemplate.isGPSTrackingEnabled) {
          this.isGPSTracingEnabled = true;
        }
        this.AssetForm.controls['geospatialObjectType'].setValue(assetTemplate.geospatialObjectType);
        if (assetTemplate.isGPSTrackingEnabled) {
          this.enableGeospatialObjectType = true;
        } else {
          this.enableGeospatialObjectType = false;
        }
        this.AssetForm.controls['isRtDataSharingEnabled'].setValue(assetTemplate.isRtDataSharingEnabled);
        if (assetTemplate.rtDataSharingTopic) {
          this.AssetForm.controls['rtDataSharingTopic'].setValue(assetTemplate.rtDataSharingTopic);
        }
      }
    })
  }

  gatewayChangeByAssetTemplate(assetTemplateId, isResetStateInfo) {
    if (isNaN(assetTemplateId)) {
      this.gatewayTemplate = [];
      this.AssetForm.controls['gateWayTemplateId'].setValue(null);
      this.AssetForm.controls['gatewayTemplateName'].setValue("");
      this.AssetForm.controls["gateWayTemplateId"].clearValidators();
      this.AssetForm.controls["gateWayTemplateId"].updateValueAndValidity();
    }
    else {
      let assetTemplateObject = this.assetTemplate.find(obj => obj.id == assetTemplateId);
      if (assetTemplateObject) {
        if (assetTemplateObject.gateWayTemplateId) {
          if (!this.AssetForm.controls['gateWayTemplateId'].value) {
            this.AssetForm.controls["gateWayTemplateId"].setValidators([Validators.required]);
            this.AssetForm.controls["gateWayTemplateId"].setValue(null);
            this.AssetForm.controls["gateWayTemplateId"].markAsTouched();
            this.AssetForm.controls["gateWayTemplateId"].updateValueAndValidity();
            this.AssetForm.controls["gateWayTemplateId"].setErrors({
              'required': true
            })
          }
          this.getGatewayTemplates(assetTemplateObject.gateWayTemplateId, isResetStateInfo);
        }
        else {
          this.AssetForm.controls["gateWayTemplateId"].setValidators([Validators.requiredTrue]);
          this.AssetForm.controls["gateWayTemplateId"].setValue(null);
          this.AssetForm.controls["gateWayTemplateId"].markAsTouched();
          this.AssetForm.controls["gateWayTemplateId"].updateValueAndValidity();
          this.AssetForm.controls["gateWayTemplateId"].setErrors({
            'requiredTrue': true
          })
        }
      }
    }
  }

  getGatewayTemplates(gateWayTemplateId, isResetStateInfo) {
    // If
    if (isResetStateInfo) {
      this.AssetForm.controls['gateWayTemplateId'].setValue(null);
      this.AssetForm.controls['gatewayTemplateName'].setValue("");
    }
    // Getting Gateway JSON to bind to html and based on selected Asset template option
    this.gatewayTemplateService.getGatewaysByTemplateId(gateWayTemplateId).subscribe(res => {
      this.gatewayTemplate = [];
      this.gatewayTemplate = res;
      this.gatewayTemplate = this.globalService.addSelectIntoList(this.gatewayTemplate);
      this.assetSharedService.setGatewayDetails(this.gatewayTemplate);
      this.printGatewayFromRes(this.AssetForm.controls['gateWayTemplateId'].value);
    },
      error => {
        // If the service is not available
        this.gatewayTemplate = [];
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  getGatewayName($event) {
    if ($event.value) {
      let selectedStateObj = this.gatewayTemplate.find(obj => obj.id == $event.itemData.id);
      this.printgateway(selectedStateObj);
    } else {
      this.AssetForm.controls['gateWayTemplateId'].setValue(null);
      this.AssetForm.controls['gatewayTemplateName'].setValue("");
    }

  }

  printGatewayFromRes(gatewayId) {
    let selectedStateObj = this.gatewayTemplate.find(obj => obj.id == gatewayId);
    this.printgateway(selectedStateObj);
  }

  printgateway(selectedStateObj) {
    if (selectedStateObj) {
      this.AssetForm.controls['gatewayTemplateName'].setValue(selectedStateObj.name);
    } else {
      this.AssetForm.controls['gatewayTemplateName'].setValue("");
    }
  }
  fetchParent() {
    //let parentAssetName;
    this.parentObj = this.globalService.listOfRow;
    if (this.parentObj.id == this.assetSharedService.selectedId) {
      this.parentObj.text = this.setParentName(this.assetSharedService.refId);
      this.AssetForm.patchValue({
        refAssetId: this.parentObj.text
      });
    }
    else {
      if (this.parentObj.text == null) {
        this.parentObj.text = this.parentObj.name
      }
      this.AssetForm.patchValue({
        refAssetId: this.parentObj.text
      });
    }
    this.parentAssetLoaderResetButton = true;
  }

  viewAsset() {
    this.assetId = this.globalService.listOfRow.id;
    if (this.assetId != null || this.assetId != undefined) {
      this.showAsset(this.globalService.listOfRow);
    }
  }
  // Edit Asset Tag
  showAsset(asset) {
    if (asset.refAssetId == null || asset.refAssetId == undefined) {
      this.fetchParentButton = true
    }
    this.assetCategoryIdForDropdownChange = this.globalService.listOfRow.assetCategoryId;
    this.AssetForm.patchValue({
      id: asset.id,
      name: asset.name,
      description: asset.description,
      assetTemplateId: asset.assetTemplateId ? asset.assetTemplateId : null,
      assetTemplateName: asset.assetTemplateName,
      assetCategoryId: asset.assetCategoryId,
      assetCategoryName: asset.assetCategoryName,
      typeId: asset.typeId,
      assetTypeName: asset.assetTypeName,
      gateWayTemplateId: asset.gateWayTemplateId ? asset.gateWayTemplateId : null,
      geospatialObjectType: asset.geospatialObjectType,
      isGPSTrackingEnabled: asset.isGPSTrackingEnabled,
      geospatialCoordinates: asset.geospatialCoordinates,
      gatewayTemplateName: asset.gatewayTemplateName,
      refAssetId: this.setParentName(asset.refAssetId),
      isRtDataSharingEnabled: asset.isRtDataSharingEnabled,
      rtDataSharingTopic: asset.rtDataSharingTopic,
      assetOrder: asset.assetOrder,
      status: asset.status,
      timeZoneId:asset.timeZoneId
    });
    if (asset.isGPSTrackingEnabled) {
      this.enableGeospatialObjectType = true;
    } else {
      this.enableGeospatialObjectType = false;
    }
    this.assetParameters = asset.assetParams;
    if (this.assetParameters) {
      this.AssetForm.setControl('assetParams', this.patchFormArray());
    }
    // Based on asset Template option getting all Gateway JSON and bind to HTML Gatway option.
    if (this.AssetForm.controls['gateWayTemplateId'].value) {
      // this.getGateway(this.AssetForm.controls['gateWayTemplateId'].value);
      this.gatewayChangeByAssetTemplate(asset.assetTemplateId, false);
    }
    //  this.getAssetTypeByCategoryId(asset.assetCategoryId);
  }
  setParentName(refAssetId) {
    let parentAssetName;
    for (var element = 0, len = this.assetSharedService.analogAssetObj.length; element < len; element++) {
      if (this.assetSharedService.analogAssetObj[element].id == refAssetId) {
        parentAssetName = this.assetSharedService.analogAssetObj[element].name;
        this.parentObj = this.assetSharedService.analogAssetObj[element];
        break;
      }
      else {
        if (this.assetSharedService.analogAssetObj[element].child.length != 0 && this.assetSharedService.analogAssetObj[element].child != undefined) {
          parentAssetName = this.childCheck(this.assetSharedService.analogAssetObj[element].child, refAssetId);
          if (parentAssetName != undefined) {
            break;
          }
        }
      }
    }
    return parentAssetName;
  }

  childCheck(child, id) {
    let parentAssetName;
    for (var e = 0, len = child.length; e < len; e++) {
      if (child[e].id == id) {
        parentAssetName = child[e].name;
        this.parentObj = child[e];
      }
      else {
        if (child[e].child.length != 0 && child[e].child != undefined) {
          parentAssetName = this.childCheck(child[e].child, id);
          if (parentAssetName != undefined) {
            break;
          }
        }
      }

    }
    return parentAssetName;
  }

  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.AssetForm.get('name').setErrors({
        pattern: true
      });
    }
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
            engUnitName:[param.engUnitName],
            assetId: [param.assetId],
            status: [param.status],
          }))
        }
      })
    }

    return formArray;
  }

  deleteAssetParameter(parameter, index) {
    this.index = index;
    this.parameter = parameter;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Parameter!');

  }

  confirmDelete() {
    const control = <FormArray>this.AssetForm.controls['assetParams'];
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


  getEngUnits() {
    this.assetTemplateListService.getEnggUnits().subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.engUnits = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  refreshTableListFunction() {

  }

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
  isGPSTracingEnabledCheckBox(checkbox: MatCheckbox) {
    if (!checkbox.checked) {
      this.AssetForm.controls.geospatialObjectType.setValue(1);
      this.enableGeospatialObjectType = true;
    } else {
      this.enableGeospatialObjectType = false;
    }
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

  ValidateGeospatialCoordinates() {
    let geospatialCoordinates = this.AssetForm.get('geospatialCoordinates').value;
    let geospatialObjectType = this.AssetForm.get('geospatialObjectType').value;
    let geospatialObjectTypeName = this.setGeospatialObjectTypeName(geospatialObjectType);
    if (geospatialCoordinates != null) {
      this.splitedGeospatialCoordinates = geospatialCoordinates.toString().split(',');
      if (geospatialCoordinates != null) {
        if (geospatialObjectTypeName == "Point") {
          this.validateCoordinatesForPoint(this.splitedGeospatialCoordinates)
        } else if (geospatialObjectTypeName == "Line") {
          this.validateCoordinatesForLine(this.splitedGeospatialCoordinates);
        } else if (geospatialObjectTypeName == "Polygon") {
          this.validateCoordinatesForPolygon(this.splitedGeospatialCoordinates)
        }
      }
    } else {
      this.validationRequired();
    }

  }
  validateCoordinatesForPoint(splitedGeospatialCoordinates: string) {
    this.clearCustomValidation();
    if (splitedGeospatialCoordinates.length >= 2) {
      this.validationRequired();
    } else if (splitedGeospatialCoordinates) {
      let isWhitespace = splitedGeospatialCoordinates[0].indexOf(' ') >= 0
      if (isWhitespace) {
        let splitedCoordinates = splitedGeospatialCoordinates[0].split(" ");
        if (splitedCoordinates.length > 2 || splitedCoordinates.length < 2) {
          this.validationRequired();
        }
      } else {
        this.validationRequired();
      }

    }
  }
  validationRequired() {
    this.AssetForm.get('geospatialCoordinates').markAsTouched();
    this.AssetForm.get('geospatialCoordinates').updateValueAndValidity();
    this.AssetForm.get('geospatialCoordinates').setErrors({
      'required': true
    });
  }
  validateCoordinatesForPolygon(splitedGeospatialCoordinates: any) {
    this.clearCustomValidation();
    this.checkLatLong(splitedGeospatialCoordinates);
    if (splitedGeospatialCoordinates[0] != splitedGeospatialCoordinates[splitedGeospatialCoordinates.length - 1]) {
      this.AssetForm.get('geospatialCoordinates').markAsTouched();
      this.AssetForm.get('geospatialCoordinates').updateValueAndValidity();
      this.AssetForm.get('geospatialCoordinates').setErrors({
        'polygonValidation': true
      });
    }
  }
  validateCoordinatesForLine(splitedGeospatialCoordinates: any) {
    this.clearCustomValidation();
    this.checkLatLong(splitedGeospatialCoordinates);
  }
  checkLatLong(splitedGeospatialCoordinates: any) {
    for (let coordinate of splitedGeospatialCoordinates) {
      let splitedCoordinates = coordinate.split(" ");
      if (splitedCoordinates.length > 2 || splitedCoordinates.length < 2) {
        this.AssetForm.get('geospatialCoordinates').markAsTouched();
        this.AssetForm.get('geospatialCoordinates').updateValueAndValidity();
        this.AssetForm.get('geospatialCoordinates').setErrors({
          'required': true
        });
        break;
      }
    }
  }
  clearCustomValidation() {
    this.AssetForm.get('geospatialCoordinates').clearValidators();
    this.AssetForm.get('geospatialCoordinates').updateValueAndValidity();
    this.AssetForm.get('geospatialCoordinates').setErrors(null)
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
  //Help method for geospatial coordinates  popup
  coordinatesHelp() {
    this.heading = 'Sample input format for Geospatial Coordinates'
    this.messageFormat = '<div class="sweatalert-help-block-message">' + 'Sample input format for Geospatial Coordinates:'
    '</div>'
    this.modelNotification.helpMessage(this.messageFormat);
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

  assetCategoryChange($event) {
    //delete this.assetTypeByCategorys;
    this.AssetForm.controls['assetCategoryName'].setValue($event.itemData.name);
    this.AssetForm.controls['assetCategoryId'].setValue($event.itemData.id);
    let assetCategoryId = +$event.itemData.id;
    this.getAssetTypeByCategoryId(assetCategoryId);
  }
  getAssetTypeByCategoryId(assetCategoryId: number) {
    this.assetTypeByCategorys = [];
    if (this.assetTypeByCategoryMap.has(assetCategoryId) && Array.isArray(this.assetTypeByCategorys) && this.assetTypeByCategorys.length) {
      this.assetTypeByCategorys = this.assetTypeByCategoryMap.get(assetCategoryId);
    } else {
      this.assetTypeByCategorys = [];
      this.assetTypes = this.assetSharedService.assetTypes;
      this.assetTypeByCategorys = this.assetTypes.filter(element => element.assetCategoryId == assetCategoryId)
    }
    if (assetCategoryId != this.assetCategoryIdForDropdownChange) {
      this.AssetForm.controls['assetTypeName'].setValue("");
      this.AssetForm.controls['typeId'].setValue(null);
      this.assetCategoryIdForDropdownChange = assetCategoryId;
    }
    if (this.assetTypeByCategorys.length) {
      this.assetTypeByCategorys = this.globalService.addSelectIntoList(this.assetTypeByCategorys);
    }
  }
  // assetTypeChange
  assetTypeChange($event) {
    if ($event.value) {
      this.AssetForm.controls['assetTypeName'].setValue($event.itemData.name);
    } else {
      this.AssetForm.controls['assetTypeName'].setValue("");
      this.AssetForm.controls['typeId'].setValue(null);
    }
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
      this.AssetForm.controls['rtDataSharingTopic'].setValue(null);
      this.AssetForm.controls['rtDataSharingTopic'].clearValidators();
      this.AssetForm.controls['rtDataSharingTopic'].updateValueAndValidity();
      this.AssetForm.controls['rtDataSharingTopic'].setErrors(null);
    }
    else {
      this.AssetForm.controls['rtDataSharingTopic'].markAsTouched();
      this.AssetForm.controls['rtDataSharingTopic'].updateValueAndValidity();
      this.AssetForm.controls['rtDataSharingTopic'].setErrors({
        'required': true
      });
    }
  }
  getTimeZoneList() {
    this.assetTemplateListService.getTimeZoneList().subscribe(res => {
        this.timeZoneData=this.globalService.addSelectIntoList(res);
        this.timeZoneFilter();
        },
      (error: any) => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  timeZoneFilter() {
    let targetTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(null == this.AssetForm.value.timeZoneId){
      this.timeZoneData.forEach(data=>{
        if(data.name == targetTimeZone){
         this.watermark = data.name;
         this.AssetForm.controls['timeZoneId'].setValue(data.id);
        }
      })
    }else{
      this.watermark = this.getTimeZoneId(this.AssetForm.value.timeZoneId);
    }
  }
  timeZoneOnChange(event) {
    if(event.itemData.id){
      this.globalService.listOfRow.timeZoneId = event.itemData.id;
      this.AssetForm.controls['timeZoneId'].setValue(event.itemData.id);
    }
}
getTimeZoneId(Name){
  if (this.timeZoneData) {
    for (let e of this.timeZoneData) {
      if (e.name == Name) {
        this.watermark = e.name;
        this.AssetForm.controls['timeZoneId'].setValue(e.id);
        break;
      }
    }
    return this.watermark;
  }}
}
