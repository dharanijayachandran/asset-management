import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { GatewayIOTag } from 'src/app/shared/model/gatewayIOTag';
import { AssetInputGateWayIOTagDiscrete } from '../../model/assetInputGateWayIOTagDiscrete';
import { AssetOutputGateWayIOTagDiscrete } from '../../model/assetOutputGateWayIOTagDiscrete';
import { AssetTag } from '../../model/assetTag';
import { AssetTagDiscreteState } from '../../model/assetTagDiscrete';
import { IOTagValue } from '../../model/IOTagValue';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { GatewayCommIOTagService } from '../../services/gateway-comm-io-tag/gateway-comm-iotag.service';
import { EmitType } from '@syncfusion/ej2-base';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { Query } from '@syncfusion/ej2-data';


@Component({
  selector: 'app-manage-discrete-asset-tag-io',
  templateUrl: './manage-discrete-asset-tag-io.component.html',
  styleUrls: ['./manage-discrete-asset-tag-io.component.css']
})
export class ManageDiscreteAssetTagIoComponent implements OnInit {
  manageDiscreteAssetTagForm: FormGroup;
  isInputExpandCollapse = false;
  isOutputExpandCollapse = false
  /*  number is fixed upto 4*/
  inputOutputCount: number[] = [1, 2, 3, 4]
  assetTagDiscreteStateobj: AssetTag;
  assetTagName: any;
  dataSource: any;
  dataSource1: any;
  inputList: GatewayIOTag[];
  outputList: GatewayIOTag[];
  displayedColumns: string[] = [];
  assetTag: any;
  noInputRerocrdFound = false;
  showAssetGatewayInputList = false;
  showAssetGatewayOutputList = false;
  assetTemplateDetais: any;
  assetGatewayInputTagDiscreteList: AssetInputGateWayIOTagDiscrete[] = [];
  assetGatewayOutputTagDiscreteList: AssetOutputGateWayIOTagDiscrete[] = [];
  noOutputRerocrdFound = false;
  warningFlag: string;
  isEditable = false;
  isInputEnabled = false;
  isOutputEnabled = false;
  @Output() navigateTemplate = new EventEmitter();
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  addInputRowAndMaximumRow: string = "Add Row for Input Tags";
  addOutputRowAndMaximumRow: string = "Add Row for Output Tags";
  inputRowLength = true;
  OutputRowLength = true;
  tempinputList: GatewayIOTag[];
  dulicateStateInput: boolean = false;
  dulicateStateOutput: boolean = false;
  showLoaderImage: boolean = false;
  assetTagDiscreteStateList: AssetTagDiscreteState[];
  gatewayAndTemplateLableName: string;
  gatewayName:any;
  public ITagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public OTagFields: Object = {
    text: 'name',
    value: 'id'
  };
  public onFilteringITag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.inputList);
  }
  public onFilteringOTag: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e,this.outputList);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown:string ='Ascending';

  gatewayIOTagId:any;
  gatewayOTagId:any
  // set the placeholder to DropDownList input element
  public ITagWaterMark: string = 'Select IO Tag';
  public OTagWaterMark: string = 'Select IO Tag';
  public filterPlaceholder:string='Search';
 // set the height of the popup element
 public height: string = '220px';
 public locale: string;
 assetGatewayInputTagDiscreteArray: AssetInputGateWayIOTagDiscrete[] = [];

  constructor(private formBuilder: FormBuilder,private globalService: globalSharedService, private gatewayCommIOTagService: GatewayCommIOTagService,private assetSharedService: AssetSharedService) { }

  ngOnInit() {
    this.manageDiscreteAssetTagIOForm();
    let requiredPath = document.location.href.split("asset-config/");
    this.gatewayAndTemplateLableName = this.globalService.setGatewayLableName(requiredPath);
    this.assetTag = this.assetSharedService.analogAssetObj;
    this.assetTagDiscreteStateList = this.assetTag.assetTagDiscreteState.sort((a, b) => a.id - b.id);
    this.setDiscreteStateData(this.assetTag.assetTagDiscreteState);
    this.assetTemplateDetais = this.globalService.listOfRow;
    if(undefined==this.assetTemplateDetais.gatewayTemplateName){
    this.gatewayName=this.assetSharedService.gatewayName;
    this.assetTemplateDetais.gatewayTemplateName=this.gatewayName;
    }
    this.inputOutputObjList();
    if (this.assetSharedService.name != "ManageIoEdit") {
      this.setmanageDiscreteAssetIoData(this.assetTag)
    } else {
      // If come from preview to edit
      let assetTag = this.setAssetTag(this.assetTag);
      this.setmanageDiscreteAssetIoData(assetTag);
    }

  }
  setDisplayedColumns() {
    if (this.assetGatewayInputTagDiscreteArray != null && this.assetGatewayInputTagDiscreteArray.length > 0) {
      this.assetGatewayInputTagDiscreteArray.forEach(element => {
            let name = element.name;
            this.displayedColumns.push(name);
      });
    }
  }
  manageDiscreteAssetTagIOForm() {
    this.manageDiscreteAssetTagForm = this.formBuilder.group({
      id: [null],
      isInputEnabled: [false],
      isOutputEnabled: [false],
      assetGatewayInputTagDiscrete: this.formBuilder.array([this.createInputObject()]),
      assetGatewayOutputTagDiscrete: this.formBuilder.array([this.createOutputObject()])
    })
  }
  createOutputObject(): FormGroup {
    return this.formBuilder.group({
      gatewayIOTagId: [null, [Validators.required]],
      ioTagValue: this.formBuilder.array([]),
    });
  }
  createInputObject(): FormGroup {
    return this.formBuilder.group({
      gatewayIOTagId: [null, Validators.required],
      ioTagValue: this.formBuilder.array([]),
    });
  }
  createInputValueObject(inputCount: number): FormArray {
    let control = <FormArray>this.manageDiscreteAssetTagForm.get(['assetGatewayInputTagDiscrete', inputCount, 'ioTagValue']);
    if (this.assetGatewayInputTagDiscreteList != null && this.assetGatewayInputTagDiscreteList.length != 0) {
      this.assetGatewayInputTagDiscreteList[0].ioTagValue.forEach(e => {
        control.push(this.getControl(e));
      });
    }
    else {
      this.assetTag.assetTagDiscreteState.forEach(e => {
        control.push(this.getIOControl(e));
      });
    }

    return control;
  }

  createOutputValueObject(outputCount: number): FormArray {
    let control = <FormArray>this.manageDiscreteAssetTagForm.get(['assetGatewayOutputTagDiscrete', outputCount, 'ioTagValue']);
    if (this.assetGatewayOutputTagDiscreteList != null && this.assetGatewayOutputTagDiscreteList.length != 0) {
      this.assetGatewayOutputTagDiscreteList[0].ioTagValue.forEach(e => {
        control.push(this.getControl(e));
      });
    }
    else {
      this.assetTag.assetTagDiscreteState.forEach(e => {
        control.push(this.getIOControl(e));
      });
    }
    return control;
  }
  getIOControl(inputObj): FormGroup {
    inputObj.gatewayIoTagValue = null;
    return this.formBuilder.group({
      id: [null],
      gatewayIoTagValue: [null, [Validators.required]],
      asssetTagDiscreteStateId: [inputObj ? inputObj.id : null]
    });
  }

  getControl(inputObj): FormGroup {
    inputObj.gatewayIoTagValue = null;
    return this.formBuilder.group({
      id: [null],
      gatewayIoTagValue: [null, [Validators.required]],
      asssetTagDiscreteStateId: [inputObj ? inputObj.asssetTagDiscreteStateId : null]
    });
  }

  public noWhitespace(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }


  setmanageDiscreteAssetIoData(discreteAssetTagobj) {
    if (discreteAssetTagobj != null) {
      this.assetTagName = discreteAssetTagobj.name;
      this.globalService.GettingString(this.assetTagName);
      if (discreteAssetTagobj.isInputEnabled == true) {
        this.isInputExpandCollapse = true;
      }
      else {
        this.isInputExpandCollapse = false;
      }
      if (discreteAssetTagobj.isOutputEnabled == true) {
        this.isOutputExpandCollapse = true;
      }
      else {
        this.isOutputExpandCollapse = false;
      }
      // bind the value in form
      this.manageDiscreteAssetTagForm.patchValue({
        id: discreteAssetTagobj.id,
        isInputEnabled: discreteAssetTagobj.isInputEnabled,
        isOutputEnabled: discreteAssetTagobj.isOutputEnabled,
        assetGatewayInputTagDiscrete: this.setgatewayInputDiscreteState(discreteAssetTagobj),
        assetGatewayOutputTagDiscrete: this.setgatewayOutputDiscreteState(discreteAssetTagobj)
      });
    }
  }

  setgatewayInputDiscreteState(assetTagObj: AssetTag): void {
    // Getting Input configuration list based on AssetTag Id
    let assetGatewayInputTagDiscrete;
    let id=0;
    if (assetTagObj.assetGatewayInputTagDiscrete) {
      assetGatewayInputTagDiscrete = assetTagObj.assetGatewayInputTagDiscrete.filter(e => {
        if (e.assetTagId == assetTagObj.id) {
          id++;
          return e;
        }
      })
    }
    if(id == 0){
      assetGatewayInputTagDiscrete = assetTagObj.assetTagDiscreteState.filter(e => {
        if (e.assetTagId == assetTagObj.id) {
          return e;
        }
      })
    }
    if (this.assetSharedService.name == "ManageIoEdit") {
      this.displayedColumns = this.assetSharedService.displayColumns;
    }
    // Bind json for Table formate
    if (this.assetSharedService.name == "ManageIoEdit") {
      this.assetGatewayInputTagDiscreteList = assetTagObj.assetGatewayInputTagDiscrete;
      this.patchInputGatewayData();
      this.showAssetGatewayOutputList = true;
      this.isEditable = true;
    } else {
      this.setInputTableFormat(assetGatewayInputTagDiscrete);
      this.setDisplayedColumns();
      this.patchInputGatewayData();
    }
  }

  patchInputGatewayData() {
    if (this.assetGatewayInputTagDiscreteList !== null && this.assetGatewayInputTagDiscreteList.length !== 0) {
      this.manageDiscreteAssetTagForm.setControl('assetGatewayInputTagDiscrete', this.patchFormArrayData(this.assetGatewayInputTagDiscreteList));
    } else {
      const control = <FormArray>this.manageDiscreteAssetTagForm.controls['assetGatewayInputTagDiscrete'];
      control.removeAt(0);
    }
  }

  setgatewayOutputDiscreteState(assetTagObj: AssetTag): void {
    let assetGatewayOutputTagDiscrete
    if (assetTagObj.assetGatewayOutputTagDiscrete) {
      assetGatewayOutputTagDiscrete = assetTagObj.assetGatewayOutputTagDiscrete.filter(e => {
        if (e.assetTagId == assetTagObj.id) {
          return e;
        }
      })
    }
    if (this.assetSharedService.name == "ManageIoEdit") {
      this.displayedColumns = this.assetSharedService.displayColumns;
    }

    if (this.assetSharedService.name == "ManageIoEdit") {
      this.assetGatewayOutputTagDiscreteList = assetTagObj.assetGatewayOutputTagDiscrete;
      this.patchOutputGatewayData();
      this.showAssetGatewayInputList = true;
      this.isEditable = true;
    } else {
      assetGatewayOutputTagDiscrete.sort((a, b) => a.id - b.id);
      this.setOutputTableFormat(assetGatewayOutputTagDiscrete);
      this.patchOutputGatewayData();
    }
  }

  patchOutputGatewayData() {
    if (this.assetGatewayOutputTagDiscreteList !== null && this.assetGatewayOutputTagDiscreteList.length !== 0) {
      this.manageDiscreteAssetTagForm.setControl('assetGatewayOutputTagDiscrete', this.patchFormArrayData(this.assetGatewayOutputTagDiscreteList));
    } else {
      const control = <FormArray>this.manageDiscreteAssetTagForm.controls['assetGatewayOutputTagDiscrete'];
      control.removeAt(0);
    }
  }
  removeDuplicates(arr) {
    var o = {}
    if (arr?.length) {
      arr.forEach(function (e) {
        o[e] = true
      })
      return Object.keys(o)
    }
    return [];
  }

  // Bind json for Table formate
  setInputTableFormat(assetGatewayInputTagDiscrete: any) {
    var gatewayIoTagInput = [];
    let assetGatewayInputTagDiscreteValue = [];
    assetGatewayInputTagDiscrete.forEach(element => {
      gatewayIoTagInput.push(element.gatewayIOTagId);
    });
    gatewayIoTagInput = this.removeDuplicates(gatewayIoTagInput);
    this.assetTag.assetTagDiscreteState.forEach(element => {
      if (element.assetGatewayIoTagDiscrete.length == 0) {
        let assetGatewayInputTagDiscreteobj: AssetInputGateWayIOTagDiscrete = new AssetInputGateWayIOTagDiscrete();
        assetGatewayInputTagDiscreteobj.assetTagId = element.assetTagId;
        assetGatewayInputTagDiscreteobj.asssetTagDiscreteStateId = element.id;
        assetGatewayInputTagDiscreteobj.gatewayIOTagId = null;
        assetGatewayInputTagDiscreteobj.name = element.asssetTagDiscreteStateName;
        assetGatewayInputTagDiscreteValue.push(assetGatewayInputTagDiscreteobj);
      } else{
        assetGatewayInputTagDiscrete.forEach(element1 => {
          if(element1.asssetTagDiscreteStateId == element.id){
            element1.name=element.asssetTagDiscreteStateName;
            assetGatewayInputTagDiscreteValue.push(element1);
          }
        });
      }
    })
    for (let i = 0; i < gatewayIoTagInput.length; i++) {
      assetGatewayInputTagDiscreteValue.forEach(element => {
        if (element.gatewayIOTagId == gatewayIoTagInput[i]) {
          this.assetGatewayInputTagDiscreteArray.push(element)
        }
        if (element.gatewayIOTagId == null) {
          this.assetGatewayInputTagDiscreteArray.push(element)
        }
      });
      let iotagValue: IOTagValue[] = [];
      let assetInputGateWayIOTagDiscrete = new AssetInputGateWayIOTagDiscrete();
      this.assetGatewayInputTagDiscreteList = [];
      if (this.assetGatewayInputTagDiscreteArray != null && this.assetGatewayInputTagDiscreteArray.length != 0) {
        this.assetGatewayInputTagDiscreteArray.sort((a, b) => a.gatewayIoTagValue - b.gatewayIoTagValue);
        this.assetGatewayInputTagDiscreteArray.forEach(element => {
          let iOTagValue = new IOTagValue();

          if (assetInputGateWayIOTagDiscrete.gatewayIOTagId == null) {
              assetInputGateWayIOTagDiscrete.gatewayIOTagId = element.gatewayIOTagId,
              iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId,
              iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          } else if (assetInputGateWayIOTagDiscrete.gatewayIOTagId == element.gatewayIOTagId) {
              iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId,
              iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          } else if (element.gatewayIOTagId == null) {
              iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId,
              iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          }
          iotagValue.push(iOTagValue);
        });
        assetInputGateWayIOTagDiscrete.ioTagValue = iotagValue;
        this.assetGatewayInputTagDiscreteList.push(assetInputGateWayIOTagDiscrete);
        this.showAssetGatewayInputList = true;
        this.isEditable = true
      }
      else {
        this.noInputRerocrdFound = true;
        this.isEditable = false
      }
    }
    if (gatewayIoTagInput.length == 0) {
      this.noInputRerocrdFound = true;
      this.isEditable = false
    }
  }

  setOutputTableFormat(assetGatewayOutputTagDiscrete: AssetOutputGateWayIOTagDiscrete[]) {
    var gatewayIoTagOutput = [];
    assetGatewayOutputTagDiscrete.forEach(element => {
      gatewayIoTagOutput.push(element.gatewayIOTagId);
    });
    gatewayIoTagOutput = this.removeDuplicates(gatewayIoTagOutput);
    this.assetTag.assetTagDiscreteState.forEach(element => {
      if (element.assetGatewayIoTagDiscrete.length == 0) {
        let assetGatewayOutputTagDiscreteobj: AssetOutputGateWayIOTagDiscrete = new AssetOutputGateWayIOTagDiscrete();
        assetGatewayOutputTagDiscreteobj.assetTagId = element.assetTagId;
        assetGatewayOutputTagDiscreteobj.asssetTagDiscreteStateId = element.id
        assetGatewayOutputTagDiscreteobj.gatewayIOTagId = null;
        assetGatewayOutputTagDiscrete.push(assetGatewayOutputTagDiscreteobj);
      }
    })
    for (let i = 0; i < gatewayIoTagOutput.length; i++) {
      let assetOutputGateWayIOTagDiscreteArray: AssetOutputGateWayIOTagDiscrete[] = [];
      assetGatewayOutputTagDiscrete.forEach(element => {
        if (element.gatewayIOTagId == gatewayIoTagOutput[i]) {
          assetOutputGateWayIOTagDiscreteArray.push(element)
        }
        if (element.gatewayIOTagId == null) {
          assetOutputGateWayIOTagDiscreteArray.push(element)
        }
      });
      let iotagValue: IOTagValue[] = [];
      let assetOutputGateWayIOTagDiscrete = new AssetOutputGateWayIOTagDiscrete();

      this.assetGatewayOutputTagDiscreteList = [];

      if (assetOutputGateWayIOTagDiscreteArray != null && assetOutputGateWayIOTagDiscreteArray.length != 0) {
        assetOutputGateWayIOTagDiscreteArray.forEach(element => {
          let iOTagValue = new IOTagValue();
          if (assetOutputGateWayIOTagDiscrete.gatewayIOTagId == null) {
            assetOutputGateWayIOTagDiscrete.gatewayIOTagId = element.gatewayIOTagId;
            iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId
            iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          }
          else if (assetOutputGateWayIOTagDiscrete.gatewayIOTagId == element.gatewayIOTagId) {
            iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId
            iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          }
          else if (element.gatewayIOTagId == null) {
            iOTagValue.id = element.id,
              iOTagValue.asssetTagDiscreteStateId = element.asssetTagDiscreteStateId
            iOTagValue.gatewayIoTagValue = element.gatewayIoTagValue
          }
          iotagValue.push(iOTagValue);
        });
        assetOutputGateWayIOTagDiscrete.ioTagValue = iotagValue;
        this.assetGatewayOutputTagDiscreteList.push(assetOutputGateWayIOTagDiscrete);

        this.showAssetGatewayOutputList = true;
        this.isEditable = true
      }
      else {
        this.noOutputRerocrdFound = true;
        this.isEditable = false
      }
    }
    if (gatewayIoTagOutput.length == 0) {
      this.noOutputRerocrdFound = true;
      this.isEditable = false
    }
  }
  patchFormArrayData(assetTagObj): FormArray {
    const formArray = new FormArray([]);
    assetTagObj.forEach(element => {
      if (element !== null) {
        formArray.push(this.formBuilder.group({
          gatewayIOTagId: [element.gatewayIOTagId, Validators.required],
          ioTagValue: this.ioTagValue(element.ioTagValue)
        }))
      }
    })
    return formArray
  }

  ioTagValue(iotagValue: IOTagValue[]): FormArray {
    const formArray1 = new FormArray([]);
    iotagValue.forEach(element => {
      formArray1.push(this.formBuilder.group({
        id: element.id,
        gatewayIoTagValue: [element.gatewayIoTagValue, [Validators.required]],
        asssetTagDiscreteStateId: element.asssetTagDiscreteStateId
      }))
    })
    return formArray1
  }
  // Click on check box Check/Uncheck ======= isInputEnabled
  isInputEnabledChange($event) {
    this.isInputExpandCollapse = $event.checked;
    this.manageDiscreteAssetTagForm.controls['isInputEnabled'].setValue($event.checked);
  }

  // Click on check box Check/Uncheck ============== isOutputEnabled
  isOutputEnabledOnChange($event) {
    this.isOutputExpandCollapse = $event.checked;
    this.manageDiscreteAssetTagForm.controls['isOutputEnabled'].setValue($event.checked);
  }

  previewManageDiscreteAssetTag() {
    this.assetTagDiscreteStateobj = <AssetTag>this.manageDiscreteAssetTagForm.value;

    if (this.assetTagDiscreteStateobj.isOutputEnabled == false) {
      this.assetTagDiscreteStateobj.assetGatewayOutputTagDiscrete = [];
    } else {
      // To check any duplicate there or not in State
      let assetGatewayOutputTagDiscrete = this.assetTagDiscreteStateobj.assetGatewayOutputTagDiscrete.length;
      if (assetGatewayOutputTagDiscrete != 0) {
        var gatewayIoTagOutput = [];
        this.assetTagDiscreteStateobj.assetGatewayOutputTagDiscrete.forEach(element => {
          gatewayIoTagOutput.push(element.gatewayIOTagId);
        });
        let duplicate = this.removeDuplicates(gatewayIoTagOutput);
        if (duplicate.length != gatewayIoTagOutput.length) {
          this.dulicateStateOutput = true;
          setTimeout(() => {
            this.dulicateStateOutput = false;
          }, 3000)
        } else this.dulicateStateOutput = false;
      }
    }

    if (this.assetTagDiscreteStateobj.isInputEnabled == false) {
      this.assetTagDiscreteStateobj.assetGatewayInputTagDiscrete = [];
    } else {
      // To check any duplicate there or not in State
      let assetGatewayInputTagDiscrete = this.assetTagDiscreteStateobj.assetGatewayInputTagDiscrete.length;
      if (assetGatewayInputTagDiscrete != 0) {
        var gatewayIoTagInput = [];
        this.assetTagDiscreteStateobj.assetGatewayInputTagDiscrete.forEach(element => {
          gatewayIoTagInput.push(element.gatewayIOTagId);
        });
        let duplicate = this.removeDuplicates(gatewayIoTagInput);
        if (duplicate.length != gatewayIoTagInput.length) {
          this.dulicateStateInput = true;
          setTimeout(() => {
            this.dulicateStateInput = false;
          }, 3000)
        } else this.dulicateStateInput = false;
      }
    }

    if (this.dulicateStateInput && this.dulicateStateOutput) {
    } else if (this.dulicateStateInput || this.dulicateStateOutput) {
    } else this.previewRedirect();
  }

  previewRedirect() {
    this.assetTagDiscreteStateobj.name = this.assetTag.name;
    this.assetTagDiscreteStateobj.assetId = this.assetTag.assetId
    this.assetTagDiscreteStateobj.dataTypeId = this.assetTag.dataTypeId;
    this.assetSharedService.analogAssetObj = this.assetTagDiscreteStateobj;
    this.globalService.setOrganizationDetail("", this.assetTemplateDetais)
    this.assetSharedService.setInputDisplayColumns(this.displayedColumns);
    this.assetSharedService.GetName("ManageIoEdit");
    this.navigateTemplate.emit('manageDiscreteTagPreview');
  }

  inputOutputObjList() {
    let gateWayTemplateId = this.assetTemplateDetais.gateWayTemplateId;
    this.gatewayCommIOTagService.getGatewayIOTagsByTemplateId(gateWayTemplateId).subscribe(
      res => {
        let gatewayIoTagList = res;
        this.assetSharedService.setGatewayIoTagList(gatewayIoTagList);
        // Dropdown list for state - input configuration and output configuration
        this.analogInputOutputTags(gatewayIoTagList);
      },
      error => {

      });
  }

  // Dropdown list for state - input configuration and output configuration
  analogInputOutputTags(gatewayIoTagList: GatewayIOTag[]) {
    this.inputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "D" && e.tagIOMode == "I") {
        return e;
      }
    });
    this.outputList = gatewayIoTagList.filter((e) => {
      if (e.tagType == "D" && e.tagIOMode == "O") {
        return e;
      }
    });
  }

  setDiscreteStateData(assetGatewayIOTagDiscrete) {
    if (assetGatewayIOTagDiscrete != null && assetGatewayIOTagDiscrete.length != 0) {
      this.assetTagDiscreteStateList.forEach(element => {
        for (let i = 0; i < assetGatewayIOTagDiscrete.length; i++) {
          if (element.id == assetGatewayIOTagDiscrete[i].id) {
            assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName = element.name;
            let name;
            name = assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName.charAt(0).toUpperCase();
            assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName = assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName.replace(assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName.charAt(0), name);
          //  this.displayedColumns.push(assetGatewayIOTagDiscrete[i].asssetTagDiscreteStateName);
            break;
          }
        }
      });
    }
  }
  isExpand(discreteAssetTagobj) {
    if (discreteAssetTagobj.isInputEnabled == true) {
      this.isInputExpandCollapse = true;
    }
  }

  addInputRow(): void {
    this.noInputRerocrdFound = false;
    this.showAssetGatewayInputList = true;
    if (this.displayedColumns.length > 0) {
      const control = <FormArray>this.manageDiscreteAssetTagForm.controls['assetGatewayInputTagDiscrete'];
      this.addInputRowAndMaximumRow = "Add Row for Input Tags"
      control.push(this.createInputObject());
      this.createInputValueObject(control.length - 1);
    }
    else {
      this.addInputRowAndMaximumRow = "Add states to Input Configuration"
    }
  }
  addOutputRow(): void {
    this.noOutputRerocrdFound = false;
    if (this.displayedColumns.length > 0) {
      const control = <FormArray>this.manageDiscreteAssetTagForm.controls['assetGatewayOutputTagDiscrete'];
      this.addOutputRowAndMaximumRow = "Add Row for Output Tags"
      control.push(this.createOutputObject());
      this.createOutputValueObject(control.length - 1);
      this.showAssetGatewayOutputList = true;
    }
    else {
      this.addOutputRowAndMaximumRow = "Add states to Output Configuration";
    }
  }

  setAssetTag(assetTagObj) {
    let assetTag: AssetTag = new AssetTag();
    assetTag.isInputEnabled = assetTagObj.isInputEnabled;
    assetTag.isOutputEnabled = assetTagObj.isOutputEnabled;
    assetTag.name = assetTagObj.name;
    assetTag.id = assetTagObj.id;
    if (assetTagObj.assetGatewayInputTagDiscrete != null && assetTagObj.assetGatewayInputTagDiscrete != 0) {
      assetTag.assetGatewayInputTagDiscrete = assetTagObj.assetGatewayInputTagDiscrete;
    }
    else {
      assetTag.assetGatewayInputTagDiscrete = [];
    }
    if (assetTagObj.assetGatewayOutputTagDiscrete != null && assetTagObj.assetGatewayOutputTagDiscrete != 0) {
      assetTag.assetGatewayOutputTagDiscrete = assetTagObj.assetGatewayOutputTagDiscrete;
    }
    else {
      assetTag.assetGatewayOutputTagDiscrete = [];
    }
    return assetTag;
  }


  // Cancel DiscreteForm the form
  cancelDiscreteForm() {
    if (this.manageDiscreteAssetTagForm.dirty) {
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
    this.assetSharedService.GetName("");
    this.globalService.GettingString('manageTags');
    this.globalService.setOrganizationDetail("", this.assetTemplateDetais);
    this.navigateTemplate.emit('discreteTagList');
    this.tabName.emit(true);

  }
  resetManageDiscreteForm() {
    if (this.manageDiscreteAssetTagForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
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

  // Form reset  confirm
  formResetConfirm() {
    this.setmanageDiscreteAssetIoData(this.assetTag);
  }
  refreshTableListFunction(){}

  gatewayITagName($event) {
    this.manageDiscreteAssetTagForm.patchValue({
      assetGatewayInputTagDiscrete: {
        gatewayIOTagName: $event.itemData.id
      }
    })
  }

  // Output tag Name
  gatewayOTagName($event) {
    this.manageDiscreteAssetTagForm.patchValue({
      assetGatewayOutputTagDiscrete: {
        gatewayIOTagId: $event.itemData.id
      }
    })
  }
}
