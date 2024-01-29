import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AnalogTag } from '../../model/analogTag ';
import { AssetInputEnabledAssetAnalogTag } from '../../model/assetInputEnabledAssetAnalogTag';
import { AssetOutputEnabledAssetAnalogTag } from '../../model/assetOutputEnabledAssetAnalogTag';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { AssetTag } from '../../model/assetTag';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { GatewayCommIOTagService } from '../../services/gateway-comm-io-tag/gateway-comm-iotag.service';

@Component({
  selector: 'app-analog-tag-form-view',
  templateUrl: './analog-tag-form-view.component.html',
  styleUrls: ['./analog-tag-form-view.component.css'],
})
export class AnalogTagFormViewComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;

  analogForm: FormGroup;
  expanded: boolean = false;
  private assetAnalogTag: AssetTag = new AssetTag();
  unitIdList: AnalogTag[];
  dataTypeList: AnalogTag[];
  analogTagId: any;
  isInputExpandCollapse = false;
  isOutputExpandCollapse = false
  sealedExpandCollapse: boolean = false;
  rangeExpandCollapse: boolean = false;
  inputList: GatewayIOTag[];
  outputList: GatewayIOTag[];
  assetStandardTagList: AssetStandardTag[] = [];
  name: any;
  isInputEnabled = false;
  isOutputEnabled = false;
  addEditText: string;
  gateWayTemplateId: number;
  assetTemplateDetail: any;
  warningFlag: string;
  saveEnable: boolean = false;
  isInputTagRequired: boolean = false;
  isOutputTagRequired: boolean = false;
  path: string;
  gatewayName: any;
  gatewayAndTemplateLableName: string;
  order: number;
  public dataTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public engUnitFields: Object = {
    text: 'name',
    value: 'id'
  };
  public assetStandardTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public ITagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public OTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  // filtering event handler to filter a Menu Icon Name
  //pass the filter data source, filter query to updateData method.
  public onFilteringDataType: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.dataTypeList);
  }

  public onFilteringEngUnit: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.unitIdList);
  }
  public onFilteringAssetStandardTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.assetStandardTagList);
  }
  public onFilteringITag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.inputList);
  }
  public onFilteringOTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.outputList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }

  public sortDropDown: string = 'Ascending';
  dataTypeId: any;
  engUnitId: any;
  orgAssetStandardTagId: any;
  gatewayITagId: any;
  gatewayOTagId: any
  // set the placeholder to DropDownList input element

  public dataTypeWaterMark: string = 'Select Data Type';
  public engUnitWaterMark: string = 'Select Engg Unit';
  public assetStandardTagMark: string = 'Select Organization Standard Tag';
  public ITagWaterMark: string = 'Select IO Tag';
  public OTagWaterMark: string = 'Select IO Tag';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;

  constructor(private formBuilder: FormBuilder, private globalService: globalSharedService,
    private route: Router, private gatewayCommIOTagService: GatewayCommIOTagService, private assetSharedService: AssetSharedService) {

  }

  ngOnInit() {
    // Checking whether clicked new analog tag and edit analog tag
    let requiredPath = document.location.href.split("asset-config/");
    this.gatewayAndTemplateLableName = this.globalService.setGatewayLableName(requiredPath);
    this.analogTagId = this.assetSharedService.selectedId;
    this.getAssetStandardTagList();
    this.dataTypeIdList();
    this.getUnitList();
    this.registerAnalogTagForm();
    this.assetTemplateDetail = this.globalService.listOfRow;
    if (this.assetTemplateDetail != null || this.assetTemplateDetail != undefined) {
      this.gateWayTemplateId = this.assetTemplateDetail.gateWayTemplateId;
      this.name = this.assetTemplateDetail.name;
    }
    else {
      this.gateWayTemplateId = this.globalService.selectedId;
      this.name = this.globalService.name;
    }
    if (undefined == this.assetTemplateDetail.gatewayTemplateName) {
      this.gatewayName = this.assetSharedService.gatewayName;
      this.assetTemplateDetail.gatewayTemplateName = this.gatewayName;
    }
    this.inputOutputObjList();
    if (this.analogTagId == null || this.analogTagId == undefined) {
      if (this.assetSharedService.analogAssetObj.hasOwnProperty('name')) {
        this.editAnalogTag(this.assetSharedService.analogAssetObj);
      }
    } else if (this.analogTagId != null) {
      this.editAnalogTag(this.assetSharedService.analogAssetObj);
    }
  }

  // Form fields
  registerAnalogTagForm() {
    this.analogForm = this.formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.pattern(this.globalService.getNamePatternForGatewayandAsset())],
      ],
      dataTypeId: [null, Validators.required],
      dataTypeName: '',
      description: [''],
      engUnitId: [null],
      orgAssetStandardTagId: [null],
      orgAssetStandardTagName: '',
      engUnitName: '',
      isInputEnabled: false,
      status: ['Active'],
      displayOrder: [, [Validators.pattern("[0-99]")]],
      gatewayITagId: [,
        [
          Validators.pattern("[0-9]*")
        ]],
      gatewayOTagId: [,
        [
          Validators.pattern("[0-9]*")
        ]],
      assetInputGatewayIoTagAnalog: this.formBuilder.group({
        id: [null],
        gatewayIOTagId: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        gatewayIOTagName: '',
        conversionMode: ["Linear"],
        linearConversionSlope: [, [
          Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")
        ]
        ],
        linearConversionIntercept: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        isScalingEnabled: [false],
        fvMin: [, [
          Validators.pattern("[0-9]*")
        ]],
        fvMax: [, [
          Validators.pattern("[0-9]*")
        ]],
        pvMin: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        pvMax: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        isClampToEuRangeValue: [false],
        euRangeValueMin: [, [
          Validators.pattern("[0-9]*")
        ]],
        euRangeValueMax: [, [
          Validators.pattern("[0-9]*")
        ]]
      }),
      isOutputEnabled: [false],
      assetOutputGatewayIoTagAnalog: this.formBuilder.group({
        id: [null],
        gatewayIOTagId: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        gatewayIOTagName: '',
        conversionMode: ["Linear"],
        linearConversionSlope: [, [
          Validators.pattern("[+-]?([0-9]*[.])?[0-9]+")
        ]
        ],
        linearConversionIntercept: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        isScalingEnabled: [false],
        fvMin: [, [
          Validators.pattern("[0-9]*")
        ]],
        fvMax: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        pvMin: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        pvMax: [,
          [
            Validators.pattern("[0-9]*")
          ]],
        isClampToEuRangeValue: [false],
        euRangeValueMin: [, [
          Validators.pattern("[0-9]*")
        ]],
        euRangeValueMax: [, [
          Validators.pattern("[0-9]*")
        ]]
      })
    })
    this.analogForm.controls['isInputEnabled'].valueChanges.subscribe(data => {
      this.inputConfigurationValidation(data);
    });
    this.analogForm.controls['isOutputEnabled'].valueChanges.subscribe(data => {
      this.outputConfigurationValidation(data);
    });
  }


  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }

  // Cancel the form
  cancelanalogForm(event) {
    if (this.analogForm.dirty) {
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
    // this.route.navigate(["assetListView"]);
    this.globalService.GettingString('manageTags');
    this.globalService.setOrganizationDetail("", this.assetTemplateDetail);;
    this.navigateTemplate.emit('analogTemplateTagList');

    // Selected ID removing form Componentwhen click cancel
    this.assetSharedService.GetId(null);

    this.tabName.emit(true);

  }

  // preview Analog
  @Output() navigateTemplate = new EventEmitter();
  previewAnalog() {
    this.globalService.selectedId = this.analogTagId;
    this.globalService.listOfRow = null;
    this.analogForm.patchValue({
      assetInputGatewayIoTagAnalog: {
        gatewayIOTagId: this.analogForm.value.gatewayITagId,
        status: this.analogForm.value.status
      },
      assetOutputGatewayIoTagAnalog: {
        gatewayIOTagId: this.analogForm.value.gatewayOTagId,
        status: this.analogForm.value.status
      }
    })
    this.isScalingEnableInput();
    this.isScalingEnableOutput();
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
    this.assetAnalogTag = this.analogForm.value;
    this.assetSharedService.analogAssetObj = this.assetAnalogTag;
    this.navigateTemplate.emit('analogTemplatePreview');
  }


  // To get all data Type list for drop down
  dataTypeIdList() {
    this.dataTypeList = this.assetSharedService.dataTypeList;
  }

  // To get all Unit Id list for drop down
  getUnitList() {
    this.unitIdList = this.assetSharedService.engUnitIdList;
  }

  // To get all asset standard tag list for drop down
  getAssetStandardTagList() {
    this.assetStandardTagList = this.assetSharedService.assetStandardTagList;
  }

  // Click on check box Check/Uncheck ======= isInputEnabled
  isInputEnabledChange($event) {
    this.isInputExpandCollapse = $event.checked;
    this.analogForm.controls['isInputEnabled'].setValue($event.checked);
  }

  // Click on check box Check/Uncheck ============== isOutputEnabled
  isOutputEnabledOnChange($event) {
    this.isOutputExpandCollapse = $event.checked;
    this.analogForm.controls['isOutputEnabled'].setValue($event.checked);
  }

  // data Type Change
  dataTypeChange($event) {
    this.analogForm.controls['dataTypeId'].setValue($event.itemData.id);
    let dataTypeId = this.analogForm.controls['dataTypeId'].value;
    if (dataTypeId == null) {
      // this.analogForm.controls['dataTypeName'].setValue([]);
    } else {
      this.analogForm.controls['dataTypeName'].setValue($event.itemData.name);
    }

  }

  // eng Unit Change
  engUnitChange($event) {
    if ($event.value) {
      this.analogForm.controls['engUnitId'].setValue($event.itemData.id);
      let dataTypeId = this.analogForm.controls['engUnitId'].value;
      if (dataTypeId == null) {
        this.analogForm.controls['engUnitName'].setValue('');
      } else {
        this.analogForm.controls['engUnitName'].setValue($event.itemData.name);
      }
    } else {
      this.analogForm.controls['engUnitName'].setValue('');
      this.analogForm.controls['engUnitId'].setValue(null);
    }

  }

  // eng Unit Change
  assetStandardTagChange($event) {
    if ($event.value) {
      this.analogForm.controls['orgAssetStandardTagId'].setValue($event.itemData.id);
      let dataTypeId = this.analogForm.controls['orgAssetStandardTagId'].value;
      if (dataTypeId == null) {
        this.analogForm.controls['orgAssetStandardTagName'].setValue('');
      } else {
        this.analogForm.controls['orgAssetStandardTagName'].setValue($event.itemData.name);
      }
    } else {
      this.analogForm.controls['orgAssetStandardTagId'].setValue(null);
      this.analogForm.controls['orgAssetStandardTagName'].setValue('');
    }
  }

  // Edit Analog Tag
  editAnalogTag(analogTag) {
    this.analogForm.patchValue({
      id: analogTag.id,
      name: analogTag.name,
      description: analogTag.description,
      dataTypeId: analogTag.dataTypeId,
      dataTypeName: analogTag.dataTypeName,
      engUnitId: analogTag.engUnitId,
      engUnitName: analogTag.engUnitName,
      orgAssetStandardTagId: analogTag.orgAssetStandardTagId,
      orgAssetStandardTagName: analogTag.orgAssetStandardTagName,
      isInputEnabled: analogTag.isInputEnabled,
      isOutputEnabled: analogTag.isOutputEnabled,
      status: analogTag.status,
      displayOrder: analogTag.displayOrder,
      gatewayITagId: this.getGetWayITagId(analogTag),
      gatewayOTagId: this.getGetWayOTagId(analogTag),
      assetInputGatewayIoTagAnalog: this.setAssetInputGatewayIoTagAnalog(analogTag),
      assetOutputGatewayIoTagAnalog: this.setAssetOutputGatewayIoTagAnalog(analogTag),
    });
    this.isExpand(analogTag);
  }

  getGetWayITagId(analogTag) {
    if (analogTag.assetInputGatewayIoTagAnalog != null) {
      return analogTag.assetInputGatewayIoTagAnalog.gatewayIOTagId;
    }
    else {
      return null;
    }
  }

  getGetWayOTagId(analogTag) {
    if (analogTag.assetOutputGatewayIoTagAnalog != null) {
      return analogTag.assetOutputGatewayIoTagAnalog.gatewayIOTagId;
    }
    else {
      return null;
    }
  }
  setAssetInputGatewayIoTagAnalog(analogTag) {
    let assetInputEnabledAssetAnalogTag: AssetInputEnabledAssetAnalogTag = new AssetInputEnabledAssetAnalogTag();
    if (analogTag.assetInputGatewayIoTagAnalog != null || analogTag.assetInputGatewayIoTagAnalog != undefined) {
      assetInputEnabledAssetAnalogTag.id = analogTag.assetInputGatewayIoTagAnalog.id;
      if (analogTag.assetInputGatewayIoTagAnalog.isScalingEnabled == true) {
        assetInputEnabledAssetAnalogTag.isScalingEnabled = analogTag.assetInputGatewayIoTagAnalog.isScalingEnabled;
        assetInputEnabledAssetAnalogTag.conversionMode = analogTag.assetInputGatewayIoTagAnalog.conversionMode;
        assetInputEnabledAssetAnalogTag.linearConversionSlope = analogTag.assetInputGatewayIoTagAnalog.linearConversionSlope;
        assetInputEnabledAssetAnalogTag.linearConversionIntercept = analogTag.assetInputGatewayIoTagAnalog.linearConversionIntercept;
        assetInputEnabledAssetAnalogTag.fvMin = analogTag.assetInputGatewayIoTagAnalog.fvMin;
        assetInputEnabledAssetAnalogTag.fvMax = analogTag.assetInputGatewayIoTagAnalog.fvMax;
        assetInputEnabledAssetAnalogTag.pvMin = analogTag.assetInputGatewayIoTagAnalog.pvMin;
        assetInputEnabledAssetAnalogTag.pvMax = analogTag.assetInputGatewayIoTagAnalog.pvMax;
      }
      else {
        assetInputEnabledAssetAnalogTag.isScalingEnabled = false;
        assetInputEnabledAssetAnalogTag.conversionMode = "Linear";
        assetInputEnabledAssetAnalogTag.linearConversionSlope = null;
        assetInputEnabledAssetAnalogTag.linearConversionIntercept = null;
        assetInputEnabledAssetAnalogTag.fvMin = null;
        assetInputEnabledAssetAnalogTag.fvMax = null;
        assetInputEnabledAssetAnalogTag.pvMin = null;
        assetInputEnabledAssetAnalogTag.pvMax = null;
      }
      if (analogTag.assetInputGatewayIoTagAnalog.isClampToEuRangeValue == true) {
        assetInputEnabledAssetAnalogTag.isClampToEuRangeValue = analogTag.assetInputGatewayIoTagAnalog.isClampToEuRangeValue;
        assetInputEnabledAssetAnalogTag.euRangeValueMin = analogTag.assetInputGatewayIoTagAnalog.euRangeValueMin;
        assetInputEnabledAssetAnalogTag.euRangeValueMax = analogTag.assetInputGatewayIoTagAnalog.euRangeValueMax;
      }
      else {
        assetInputEnabledAssetAnalogTag.isClampToEuRangeValue = false;
        assetInputEnabledAssetAnalogTag.euRangeValueMin = null;
        assetInputEnabledAssetAnalogTag.euRangeValueMax = null;
      }
    }
    else {
      return '';
    }
    return assetInputEnabledAssetAnalogTag;
  }
  isScalingEnableInput() {
    let isScaling = this.analogForm.get(['assetInputGatewayIoTagAnalog', 'isScalingEnabled']).value
    if (isScaling) {
    } else {
      this.analogForm.get(['assetInputGatewayIoTagAnalog', 'conversionMode']).setValue(null);
    }
  }
  isScalingEnableOutput() {
    let isScaling = this.analogForm.get(['assetOutputGatewayIoTagAnalog', 'isScalingEnabled']).value
    if (isScaling) {
    } else {
      this.analogForm.get(['assetOutputGatewayIoTagAnalog', 'conversionMode']).setValue(null);
    }
  }

  setAssetOutputGatewayIoTagAnalog(analogTag) {
    let assetOutputEnabledAssetAnalogTag: AssetOutputEnabledAssetAnalogTag = new AssetOutputEnabledAssetAnalogTag();
    if (analogTag.assetOutputGatewayIoTagAnalog != null || analogTag.assetOutputGatewayIoTagAnalog != undefined) {
      assetOutputEnabledAssetAnalogTag.id = analogTag.assetOutputGatewayIoTagAnalog.id;
      if (analogTag.assetOutputGatewayIoTagAnalog.isScalingEnabled == true) {
        assetOutputEnabledAssetAnalogTag.isScalingEnabled = analogTag.assetOutputGatewayIoTagAnalog.isScalingEnabled;
        assetOutputEnabledAssetAnalogTag.conversionMode = analogTag.assetOutputGatewayIoTagAnalog.conversionMode;
        assetOutputEnabledAssetAnalogTag.linearConversionSlope = analogTag.assetOutputGatewayIoTagAnalog.linearConversionSlope;
        assetOutputEnabledAssetAnalogTag.linearConversionIntercept = analogTag.assetOutputGatewayIoTagAnalog.linearConversionIntercept;
        assetOutputEnabledAssetAnalogTag.fvMin = analogTag.assetOutputGatewayIoTagAnalog.fvMin;
        assetOutputEnabledAssetAnalogTag.fvMax = analogTag.assetOutputGatewayIoTagAnalog.fvMax;
        assetOutputEnabledAssetAnalogTag.pvMin = analogTag.assetOutputGatewayIoTagAnalog.pvMin;
        assetOutputEnabledAssetAnalogTag.pvMax = analogTag.assetOutputGatewayIoTagAnalog.pvMax;
      } else {
        assetOutputEnabledAssetAnalogTag.isScalingEnabled = false;
        assetOutputEnabledAssetAnalogTag.conversionMode = "Linear";
        assetOutputEnabledAssetAnalogTag.linearConversionSlope = null;
        assetOutputEnabledAssetAnalogTag.linearConversionIntercept = null;
        assetOutputEnabledAssetAnalogTag.fvMin = null;
        assetOutputEnabledAssetAnalogTag.fvMax = null;
        assetOutputEnabledAssetAnalogTag.pvMin = null;
        assetOutputEnabledAssetAnalogTag.pvMax = null;
      }
      if (analogTag.assetOutputGatewayIoTagAnalog.isClampToEuRangeValue == true) {
        assetOutputEnabledAssetAnalogTag.isClampToEuRangeValue = analogTag.assetOutputGatewayIoTagAnalog.isClampToEuRangeValue
        assetOutputEnabledAssetAnalogTag.euRangeValueMin = analogTag.assetOutputGatewayIoTagAnalog.euRangeValueMin
        assetOutputEnabledAssetAnalogTag.euRangeValueMax = analogTag.assetOutputGatewayIoTagAnalog.euRangeValueMax
      }
      else {
        assetOutputEnabledAssetAnalogTag.isClampToEuRangeValue = false;
        assetOutputEnabledAssetAnalogTag.euRangeValueMin = null;
        assetOutputEnabledAssetAnalogTag.euRangeValueMax = null;
      }
    }
    else {
      return '';
    }
    return assetOutputEnabledAssetAnalogTag;
  }

  isExpand(analogTag) {
    if (analogTag.isInputEnabled == true) {
      this.isInputExpandCollapse = true;
      if (analogTag.assetInputGatewayIoTagAnalog.isScalingEnabled == true) {
        this.sealedExpandCollapse = analogTag.assetInputGatewayIoTagAnalog.isScalingEnabled;
      }
      else {
        this.sealedExpandCollapse = false;
      }
      if (analogTag.assetInputGatewayIoTagAnalog.isClampToEuRangeValue == true) {
        this.rangeExpandCollapse = analogTag.assetInputGatewayIoTagAnalog.isClampToEuRangeValue;
      }
      else {
        this.rangeExpandCollapse = false;
      }
    }
    else {
      this.isInputExpandCollapse = false;
    }

    if (analogTag.isOutputEnabled == true) {
      this.isOutputExpandCollapse = true;
      if (analogTag.assetOutputGatewayIoTagAnalog.isScalingEnabled == true) {
        this.sealedExpandCollapse = analogTag.assetOutputGatewayIoTagAnalog.isScalingEnabled;
      }
      else {
        this.sealedExpandCollapse = false;
      }
      if (analogTag.assetOutputGatewayIoTagAnalog.isClampToEuRangeValue == true) {
        this.rangeExpandCollapse = analogTag.assetOutputGatewayIoTagAnalog.isClampToEuRangeValue;
      }
      else {
        this.rangeExpandCollapse = false;
      }
    }
    else {
      this.isOutputExpandCollapse = false;
    }
  }
  // Reset analog form
  resetAnalogForm() {
    if (this.analogForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  // Form reset  confirm
  formResetConfirm() {
    if (this.analogTagId != null) {
      this.editAnalogTag(this.assetSharedService.analogAssetObj);
    } else {
      this.registerAnalogTagForm();
      this.isOutputExpandCollapse = false;
      this.isInputExpandCollapse = false;
      this.sealedExpandCollapse = false;
      this.rangeExpandCollapse = false;
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

  inputOutputObjList() {
    this.gatewayCommIOTagService.getGatewayIOTagsByTemplateId(this.gateWayTemplateId).subscribe(
      res => {
        let gatewayIoTagList = res;
        this.analogInputOutputTags(gatewayIoTagList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  analogInputOutputTags(gatewayIoTagList: GatewayIOTag[]) {
    this.inputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "A" && e.tagIOMode == "I") {
        return e;
      }
    });
    this.outputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "A" && e.tagIOMode == "O") {
        return e;
      }
    });
  }
  // gateway IOTagName
  gatewayITagName($event) {
    this.analogForm.patchValue({
      assetInputGatewayIoTagAnalog: {
        gatewayIOTagName: $event.itemData.name
      }
    })
  }

  // Output tag Name
  gatewayOTagName($event) {
    this.analogForm.patchValue({
      assetOutputGatewayIoTagAnalog: {
        gatewayIOTagName: $event.itemData.name
      }
    })
  }
  onKey(event: any) {
    let isDH = this.globalService.doubleHyphen(event);
    if (isDH) {
      this.analogForm.get('name').setErrors({
        pattern: true
      });
    }
  }

  setInputTagValidation(data) {
    if (data == true) {
      this.analogForm.controls["gatewayITagId"].setValidators([Validators.required,
      Validators.pattern("[0-9]*")
      ]);
    }
    else {
      this.analogForm.controls['gatewayITagId'].setValue(null);
      this.analogForm.controls["gatewayITagId"].setValidators([
        Validators.pattern("[0-9]*")
      ]);
    }

  }
  setOutputTagValidation(data) {
    if (data == true) {
      this.analogForm.controls["gatewayOTagId"].setValidators([Validators.required,
      Validators.pattern("[0-9]*")
      ]);
    }
    else {
      this.analogForm.controls['gatewayOTagId'].setValue(null);
      this.analogForm.controls["gatewayOTagId"].setValidators([
        Validators.pattern("[0-9]*")
      ]);
    }
  }
  inputConfigurationValidation(data) {
    if (data == true) {
      this.saveEnable = true;
      this.isInputEnabled = true;
    }
    else {
      this.disableSaveButton();
      this.isInputEnabled = false;
    }
    this.setInputTagValidation(data);

  }
  outputConfigurationValidation(data) {
    if (data == true) {
      this.saveEnable = true;
      this.isOutputEnabled = true;
    } else {
      this.disableSaveButton();
      this.isOutputEnabled = false;
    }
    this.setOutputTagValidation(data);
  }
  disableSaveButton() {
    if (this.isInputEnabled == true || this.isOutputEnabled == true) {
      this.saveEnable = true
    }
    else {
      this.saveEnable = false;
    }

  }
}

