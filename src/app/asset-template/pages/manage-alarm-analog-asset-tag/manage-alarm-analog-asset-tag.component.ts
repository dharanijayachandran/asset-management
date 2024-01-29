import { formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { EmitType } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { FilteringEventArgs } from '@syncfusion/ej2-dropdowns';
import { UIModalNotificationPage } from 'global';
import { AssetService } from 'src/app/asset/services/asset/asset.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AlarmConfig } from '../../model/AlarmConfig';
import { AlarmNotificationConfig } from '../../model/alarmNotificationConfig';
import { AlarmStateNotificationConfig } from '../../model/alarmStateNotificationConfig';
import { AnalogTag } from '../../model/analogTag ';
import { AnalogTagService } from '../../services/analogTag/analog-tag.service';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
@Component({
  selector: 'app-manage-alarm-analog-asset-tag',
  templateUrl: './manage-alarm-analog-asset-tag.component.html',
  styleUrls: ['./manage-alarm-analog-asset-tag.component.css']
})
export class ManageAlarmAnalogAssetTagComponent implements OnInit {
  numberError: boolean;
  stateNameDisableEnableStatus: boolean = true;
  timeDeadDisableEnableStatus: boolean = true;
  uncheckCheckedBox = '';
  uncheckCheckedBoxtimeDead = '';
  messageFormat: string;
  heading: string;
  selectedAsset: any;
  constructor(private formBuilder: FormBuilder, private sharedService: AssetSharedService,
    private analogTagService: AnalogTagService, private globalService: globalSharedService,
    private elem: ElementRef, private assetService: AssetService) { }
  dataSource: any;
  saveLarmTypes: AlarmConfig[];
  removeUnselectedTypes: AlarmConfig[];
  smsNotificationGroupError: boolean;
  emailNotificationGroupError: boolean;
  notifcationMedias: any[];
  notificationGroups: any[];
  analogAssetTag: AnalogTag;
  analogAlarmForm: FormGroup;
  alarmTypes: any[];
  alarmStates: any[];
  displayedColumns: string[] = ['alarmState', 'smsNotificationGroup', 'repeatNotification'];
  formData: AlarmConfig;
  limitAlarms: AlarmConfig[];
  alarmForm = false;
  alarmFormPreview = false;
  alarmConfigsFromDB: AlarmConfig[];
  alarmConfigWithAsset: { alarmConfigs: AlarmConfig[]; entity: any };
  alarmPage: AlarmConfig;
  @ViewChild(UIModalNotificationPage) modelNotification;
  @Output() navigateTemplate = new EventEmitter();
  warningFlag: string;
  analogFormError = false;
  alarmSeveritys: any[];
  smsNotificationGroup: AlarmStateNotificationConfig[];
  emailNotificationGroup: AlarmStateNotificationConfig[];
  alarmStateNotificationConfigs: AlarmStateNotificationConfig[];
  alarmNotificationConfigs: AlarmNotificationConfig[];
  savedAlarmNotificationConfigs: AlarmNotificationConfig[];
  tempAlarmNotificationConfigs: AlarmNotificationConfig[];
  modeifiedAlarmNotificationConfigs: AlarmStateNotificationConfig[][] = [];
  disableSaveButton = false;
  stateSelectError = false;
  notifConfigError = false;
  alarmConfig: AlarmConfig;
  notificationGroupMedias: any[];
  notifcationAndMediaGrps: any[] = [];
  showLoaderImage = false;
  assetResponse: any;
  public alarmSevierityFields: Object = {
    text: 'name',
    value: 'id'
  };
  public alarmTypeFields: Object = {
    text: 'name',
    value: 'id'
  };
  public onFilteringAlarmTypes: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.alarmTypes);
  }
  public onFilteringAlarmSevierity: EmitType<FilteringEventArgs> = (e: FilteringEventArgs) => {
    this.filterData(e, this.alarmSeveritys);
  }
  filterData(e: FilteringEventArgs, filterData) {
    let query: Query = new Query();
    //frame the query based on search string with filter type.
    query = (e.text !== '') ? query.where('name', 'contains', e.text, true) : query;
    e.updateData(filterData, query);
  }
  public sortDropDown: string = 'Ascending';
  alarmSevierity: any;
  alarmTypeId: any;
  gateWayTemplateId: any;

  // set the placeholder to DropDownList input element

  public alarmSevierityWaterMark: string = 'Select Alarm Sevierty';
  public alarmTypeWaterMark: string = 'Select Alarm Type';
  public assetTypeWaterMark: string = 'Select Asset Type';
  public filterPlaceholder: string = 'Search';
  // set the height of the popup element
  public height: string = '220px';
  public locale: string;
  validTillDay: { day: number; month: number; year: number; };
  minDate: { day: number; month: number; year: number; };
  todayDate: { day: number; month: number; year: number; };
  curDate: string;
  startDateTime: any;
  endDateTime: any;
  startDate: any;
  endDate: any;
  validateTime: boolean = false;
  validateEndTime: boolean = false;
  ngOnInit(): void {
    this.loadFormData();
    if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
      this.analogAlarmForm.controls['assetTagName'].setValue(this.globalService.assetTagName);
    }
  }
  loadFormData() {
    this.selectedAsset = this.globalService.listOfRow;
    this.getAssetResponse();
    this.alarmConfig = this.sharedService.globalObject;
    this.analogAssetTag = this.sharedService.analogAssetObj;
    this.validateForm();
    this.getAlarmStates();
    this.getAlarmSeveritys();
    this.getAlarmTypesForAnalog();
    this.patchFormData();
    this.alarmForm = true;
  }
  getAssetResponse() {
    if (this.selectedAsset.id) {
      let assetId = this.selectedAsset.id
      this.analogTagService.getAssetsById(assetId).subscribe(res => {
        let assetObject = res[0];
        if (assetObject) {
          this.setAssetTagsToAsssetResponse(assetObject);
          if (assetObject.subAssets && assetObject.subAssets.length) {
            this.iterateChildAssets(assetObject.subAssets);
          }
        }
        this.assetResponse = assetObject;
      },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        }
      )
    }
  }
  iterateChildAssets(subAssets: any[]) {
    subAssets.forEach(childAsset => {
      this.assetService.getAssetTagsByAssetId(childAsset.id).subscribe(res => {
        childAsset.assetTags = res;
        if (childAsset.subAssets && childAsset.subAssets.length) {
          this.iterateChildAssets(childAsset.subAssets);
        }
      })
    })
  }
  setAssetTagsToAsssetResponse(assetObject) {
    this.assetService.getAssetTagsByAssetId(assetObject.id).subscribe(res => {
      assetObject.assetTags = res;
    })
  }
  patchFormData() {
    this.analogAlarmForm.patchValue({
      assetTemplateName: this.analogAssetTag.assetTemplateName,
      assetTagName: this.analogAssetTag.name
    })
  }

  // Checkbox validating if entered value
  alermState(state) {
    this.uncheckCheckedBox = state.length;
    // var numbers = /^[0-9]+$/;
    var numbers = /^\d+(\.\d+)?$/;
    if (state.match(numbers)) {
      this.stateNameDisableEnableStatus = false;
    } else {
      this.stateNameDisableEnableStatus = true;
      // this.analogAlarmForm.get('valueDeadBandOnRaise').setValue(false);
      // this.analogAlarmForm.get('valueDeadBandOnClear').setValue(false);
      this.uncheckCheckedBox = '';
    }
  }
  // Checkbox validating if entered value
  timeDeadBandInSecState(timeDead) {
    this.uncheckCheckedBoxtimeDead = timeDead.length;
    var numbers = /^\d+(\.\d+)?$/;
    if (timeDead.match(numbers)) {
      this.timeDeadDisableEnableStatus = false;
    } else {
      this.timeDeadDisableEnableStatus = true;
      this.uncheckCheckedBoxtimeDead = '';
    }
  }
  validateForm() {
    this.analogAlarmForm = this.formBuilder.group({
      assetTemplateName: [''],
      assetTagName: [''],
      id: [null],
      alarmTypeId: [null, Validators.required],
      alarmMessage: [null, Validators.required],
      status: ['Active'],
      name: [null, Validators.required],
      alarmConditionValue: [null, [Validators.required, Validators.pattern(/[+-]?[0-9]\d*(\.\d+)?%?$/)]],
      alarmSevierity: [null, Validators.required],
      valueDeadBand: [null, [Validators.pattern(/^[0-9]\d{0,5}(\.\d{1,4})?%?$/), Validators.maxLength(11)]],
      valueDeadBandOnRaise: false,
      valueDeadBandOnClear: false,
      timeDeadBandInSec: [null, Validators.pattern("[0-9]*")],
      timeDeadBandOnRaise: false,
      timeDeadBandOnClear: false,
      smsNotification: false,
      emailNotification: false,
      smsNotificationGroupId: [null],
      emailNotificationGroupId: [null],
      clearAlarmMessage: [null],
      validFromDate: [null],
      validTillDate: [null],
      startTime: [null],
      endTime: [null],
      alarmNotificationConfigs: this.formBuilder.array([
        //this.addalarmNotificationConfig()
      ])
    });
  }
  addalarmNotificationConfig() {
    let fg = this.formBuilder.group({
      isAssign: false,
      notificationMediaId: [null],
      notificationGroupId: { value: null, disabled: true },
      alarmStateNotificationConfigs: this.formBuilder.array([
        this.addLimitAlarms()
      ])
    });
    (<FormArray>this.analogAlarmForm.get('alarmNotificationConfigs')).push(fg);
    let index = (<FormArray>this.analogAlarmForm.get('alarmNotificationConfigs')).length - 1;
    this.createDataSourceFormArray(index);

  }
  createDataSourceFormArray(index) {
    this.dataSource = new MatTableDataSource();
    const controlSms = <FormArray>this.analogAlarmForm.get('alarmNotificationConfigs')['controls'][index].get('alarmStateNotificationConfigs') as FormArray;
    let smsData = this.dataSource.data;
    smsData = [];
    if (null !== this.alarmStates && this.alarmStates.length !== 0) {
      for (let type of this.alarmStates) {
        controlSms.push(this.addLimitAlarms());
        smsData.push(controlSms.disable());
      }
      this.dataSource.data = [];
      this.dataSource.data = this.alarmStates;
    }
  }
  addLimitAlarms(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      isAssign: { value: false, disabled: true },
      notificationGroupId: { value: null, disabled: true },
      alarmNotificationConfigId: [null],
      alarmState: [null],
      notificationRepeatIntervalSec: { value: null, disabled: true },
    })
  }
  getNotificationMedia() {
    this.analogTagService.getNotificationMedia().subscribe(res => {
      this.notifcationMedias = res;
      this.notifcationMedias = this.notifcationMedias.sort((a, b) => a.id - b.id);
      let index = 0;
      if (null != this.alarmConfig) {
        this.getAlarmConfigByAlarmConfigId(this.alarmConfig.id);
      } else {
        for (let media of this.notifcationMedias) {
          this.addalarmNotificationConfig();
          index++;
        }
      }
      this.getNotificationGroupByOrganizationId();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }
  getAlarmConfigByAlarmConfigId(id: any) {
    this.analogTagService.getAlarmConfigById(id).subscribe(data => {
      this.formData = data;
      this.savedAlarmNotificationConfigs = this.formData.alarmNotificationConfigs;
      this.tempAlarmNotificationConfigs = this.formData.alarmNotificationConfigs;
      this.patchAnalogFormData();
      this.analogAlarmForm.setControl('alarmNotificationConfigs', this.patchAlarmNotificationConfigFormArray())
    })
  }
  patchStateFormArray(index, found): FormArray {
    // this.validateForm();
    this.dataSource = new MatTableDataSource();
    const formArray2 = new FormArray([]);
    this.dataSource.data = this.alarmStates;
    this.alarmStates.forEach(alarmState => {
      let i = 0;
      let selected = false;
      let alarmStateNotificationConfigs = [];
      if (this.savedAlarmNotificationConfigs[index]) {
        alarmStateNotificationConfigs = this.savedAlarmNotificationConfigs[index].alarmStateNotificationConfigs
      }
      for (let state of alarmStateNotificationConfigs) {
        if (state.alarmState == alarmState.id) {
          selected = true;
          break;
        }
        i++;
      }
      if (selected) {
        formArray2.push(this.formBuilder.group({
          isAssign: true,
          id: alarmStateNotificationConfigs[i].id,
          notificationGroupId: alarmStateNotificationConfigs[i].notificationGroupId,
          alarmNotificationConfigId: alarmStateNotificationConfigs[i].notificationRepeatIntervalSec,
          alarmState: alarmStateNotificationConfigs[i].notificationRepeatIntervalSec,
          notificationRepeatIntervalSec: [alarmStateNotificationConfigs[i].notificationRepeatIntervalSec, Validators.pattern("[0-9]*")],
          status: alarmStateNotificationConfigs[i].status
        }))
      } else {
        if (found) {
          formArray2.push(this.formBuilder.group({
            id: [null],
            isAssign: false,
            notificationGroupId: { value: null, disabled: true },
            alarmNotificationConfigId: [null],
            alarmState: [null],
            notificationRepeatIntervalSec: { value: null, disabled: true }

          }))
        } else {
          formArray2.push(this.formBuilder.group({
            id: [null],
            isAssign: { value: false, disabled: true },
            notificationGroupId: { value: null, disabled: true },
            alarmNotificationConfigId: [null],
            alarmState: [null],
            notificationRepeatIntervalSec: { value: null, disabled: true }

          }))
        }

      }
    })
    return formArray2
  }
  patchAlarmNotificationConfigFormArray(): FormArray {
    const formArray = new FormArray([]);
    this.notifcationMedias.forEach(media => {
      let matched = false;
      let index = 0;
      for (let saved of this.savedAlarmNotificationConfigs) {
        if (media.id == saved.notificationMediaId) {
          matched = true;
          break;
        }
        index++
      }
      if (matched) {
        formArray.push(this.formBuilder.group({
          id: this.savedAlarmNotificationConfigs[index].id,
          notificationMediaId: this.savedAlarmNotificationConfigs[index].notificationMediaId,
          notificationGroupId: [this.savedAlarmNotificationConfigs[index].notificationGroupId, Validators.required],
          isAssign: true,
          status: this.savedAlarmNotificationConfigs[index].status,
          alarmStateNotificationConfigs: this.patchStateFormArray(index, true)
        }))
        // this.sectionEnableDisable(true,index)
      } else {
        formArray.push(this.formBuilder.group({
          id: null,
          isAssign: false,
          notificationMediaId: [null],
          notificationGroupId: { value: null, disabled: true },
          status: null,
          alarmStateNotificationConfigs: this.patchStateFormArray(index, false)
        }))
      }

    })
    return formArray;
  }


  patchAnalogFormData() {
    this.analogAlarmForm.patchValue({
      id: this.formData.id,
      alarmTypeId: this.formData.alarmTypeId,
      alarmMessage: this.formData.alarmMessage,
      status: this.formData.status,
      name: this.formData.name,
      alarmConditionValue: this.formData.alarmConditionValue,
      alarmSevierity: this.formData.alarmSevierity,
      valueDeadBand: this.valueDeadBand(this.formData.valueDeadBand),
      valueDeadBandOnRaise: this.formData.valueDeadBandOnRaise,
      valueDeadBandOnClear: this.formData.valueDeadBandOnClear,
      timeDeadBandInSec: this.timeDeadBandInSec(this.formData.timeDeadBandInSec),
      timeDeadBandOnRaise: this.formData.timeDeadBandOnRaise,
      timeDeadBandOnClear: this.formData.timeDeadBandOnClear,
      clearAlarmMessage: this.formData.clearAlarmMessage,
      // validFromDate: this.formData.validFromDate,
      validFromDate: this.editDateFormat(this.formData.validFromDate),
      validTillDate: this.editDateFormat(this.formData.validTillDate),
      startTime: this.formData.startTime,
      endTime: this.formData.endTime
    })
  }
  editDateFormat(date): any {
    if (date != null) {
      var dateformat = new Date(date);
      let arrayDate = formatDate(dateformat, 'dd/MM/yyyy', 'en').split('/');
      let dateFormat = {
        day: parseInt(arrayDate[0]),
        month: parseInt(arrayDate[1]),
        year: parseInt(arrayDate[2])
      }
      return dateFormat;
    }
  }

  // To enable and disable check box
  valueDeadBand(value) {
    if (value != undefined || value != null) {
      this.alermState(value.toString())
    } else {
      // this.alermState(value);
    }

    return value;
  }

  // timeDeadBandInSec
  timeDeadBandInSec(value) {
    if (value != undefined || value != null) {
      this.timeDeadBandInSecState(value.toString())
    } else {
      // this.alermState(value);
    }

    return value;
  }



  getAlarmStates() {
    this.analogTagService.getAlarmStates().subscribe(res => {
      this.getNotificationMedia();
      if (null != res) {
        res = res.sort((a, b) => a.id - b.id);
      }
      this.alarmStates = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getAlarmTypesForAnalog() {
    this.analogTagService.getAlarmTypesForAnalog().subscribe(res => {
      if (res != null) {
        this.alarmTypes = res.filter(e => e.tagType == 'A');

      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getAlarmSeveritys() {
    this.analogTagService.getAlarmSeveritys().subscribe(res => {
      this.alarmSeveritys = res;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getNotificationGroupByOrganizationId() {
    let beId = parseInt(sessionStorage.getItem('beId'));
    this.analogTagService.getNotofcationGroupByOrgId(beId).subscribe(data => {
      this.notificationGroups = data;
      this.getNotificationGroupMedia();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getNotificationGroupMedia() {
    this.analogTagService.getNotificationGroupMedia().subscribe(data => {
      this.notificationGroupMedias = data;
      this.notifcationMedias.forEach(media => {
        let grpMedias = [];
        this.notificationGroupMedias.forEach(grpMedia => {
          if (media.id == grpMedia.notificationMediaId) {
            this.notificationGroups.forEach(grp => {
              if (grpMedia.notificationGroupId == grp.id) {
                grpMedias.push(grpMedia);
              }
            })
          }
        })
        this.notifcationAndMediaGrps.push(grpMedias);
      })
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  previewModeFormData() {
    this.analogFormError = false;
    this.stateSelectError = false;
    this.notifConfigError = false;
    let check = false;
    let userId = parseInt(sessionStorage.getItem('userId'));
    let beId = parseInt(sessionStorage.getItem('beId'));
    /* if (this.startDate != null) {
      if (this.startDate.year != null && this.startDate.month != null && this.startDate.day != null) {
        this.startDate = this.startDate.day + '/' + this.startDate.month + '/' + this.startDate.year;
      }
    }
    if (this.endDate != null) {
      if (this.endDate.year != null && this.endDate.month != null && this.endDate.day != null) {
        this.endDate = this.endDate.day + '/' + this.endDate.month + '/' + this.endDate.year;
      }
    } */
    this.getMilliSeconds(this.analogAlarmForm.value.validFromDate, this.analogAlarmForm.value.validTillDate);
    this.analogAlarmForm.patchValue({
      validFromDate: this.startDateTime,
      validTillDate: this.endDateTime
    });
    this.formData = <AlarmConfig>this.analogAlarmForm.value;
    this.formData.createdBy = userId;
    if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
      this.formData.alarmEntityId = this.alarmConfig.alarmEntityId;
    }
    else {
      this.formData.alarmEntityId = this.analogAssetTag.id;
    }
    this.formData.businessEntityId = beId;
    this.alarmNotificationConfigs = this.formData.alarmNotificationConfigs;
    for (let i = 0; i < this.notifcationMedias.length; i++) {
      this.alarmNotificationConfigs[i].notificationMediaId = this.notifcationMedias[i].id;
      this.alarmNotificationConfigs[i].notificationMediaName = this.notifcationMedias[i].name;
      this.notifcationAndMediaGrps.forEach(medias => {
        medias.forEach(grp => {
          let id = this.parseInt(this.alarmNotificationConfigs[i].notificationGroupId);
          if (grp.notificationGroupId == id) {
            this.alarmNotificationConfigs[i].notificationGroupName = grp.notificationGroup.name;
          }
        })
      })
      this.alarmNotificationConfigs[i].createdBy = userId;
    }
    this.alarmNotificationConfigs = this.alarmNotificationConfigs.filter(notifConfig => notifConfig.isAssign);
    if (null != this.alarmNotificationConfigs && this.alarmNotificationConfigs.length != 0) {
      let alarmNotifConfs = [];
      this.alarmNotificationConfigs.forEach(notifConfig => {
        let index = 0;
        if (null != notifConfig.notificationGroupId) {
          this.alarmStateNotificationConfigs = notifConfig.alarmStateNotificationConfigs;
          for (let i = 0; i < this.alarmStates.length; i++) {
            this.alarmStateNotificationConfigs[i].alarmState = this.alarmStates[i].id;
            this.alarmStateNotificationConfigs[i].alarmStateName = this.alarmStates[i].name;
            this.alarmStateNotificationConfigs[i].createdBy = userId;
            this.notifcationAndMediaGrps.forEach(medias => {
              medias.forEach(grp => {
                if (grp.notificationGroupId == this.parseInt(this.alarmStateNotificationConfigs[i].notificationGroupId)) {
                  this.alarmStateNotificationConfigs[i].notificationGroupName = grp.notificationGroup.name;
                }
              })
            })
          }
          this.modeifiedAlarmNotificationConfigs.push(this.alarmStateNotificationConfigs)
          this.alarmStateNotificationConfigs = this.alarmStateNotificationConfigs.filter(state => state.isAssign);
          if (null != this.alarmStateNotificationConfigs) {
            notifConfig.alarmStateNotificationConfigs = this.alarmStateNotificationConfigs
          }
        } else {
          check = true;
          this.notifConfigError = true;
          return
        }
        alarmNotifConfs.push(notifConfig);
        index++;
      })
      if (!check) {
        this.formData.alarmNotificationConfigs = alarmNotifConfs;
        if (null != this.savedAlarmNotificationConfigs) {
          this.formData.alarmNotificationConfigs.forEach(element => {
            this.savedAlarmNotificationConfigs = this.savedAlarmNotificationConfigs.filter(saved => saved.id != element.id)
          })
        }
      }
    }
    else {
      this.formData.alarmNotificationConfigs = this.alarmNotificationConfigs
    }
    if (!check) {
      this.alarmFormPreview = true;
      this.alarmForm = false;
    }
  }
  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }

  onClickSaveAlaramConfig() {
    this.showLoaderImage = true;
    let userId = parseInt(sessionStorage.getItem('userId'));
    if (null != this.savedAlarmNotificationConfigs && this.savedAlarmNotificationConfigs.length != 0) {
      this.savedAlarmNotificationConfigs.forEach(element => {
        element.status = 'Deleted';
        element.createdBy = userId
        element.alarmStateNotificationConfigs.forEach(state => {
          state.status = 'Deleted'
          state.createdBy = userId
        })
        this.formData.alarmNotificationConfigs.push(element);
        this.tempAlarmNotificationConfigs = this.tempAlarmNotificationConfigs.filter(temp => temp.id != element.id)
      });
    }
    for (let i = 0; i < this.formData.alarmNotificationConfigs.length; i++) {
      if (this.modeifiedAlarmNotificationConfigs[i]) {
        let tempStates = this.modeifiedAlarmNotificationConfigs[i]
        tempStates.forEach(temp => {
          if (null != temp.id && !temp.isAssign) {
            temp.createdBy = userId;
            temp.status = 'Deleted';
            this.formData.alarmNotificationConfigs[i].alarmStateNotificationConfigs.push(temp);
          }
        })
      }
    }
    if (this.formData.timeDeadBandInSec == '') {
      this.formData.timeDeadBandInSec = null;
    }
    if (this.formData.valueDeadBand == '') {
      this.formData.valueDeadBand = null;
    }
    if (null == this.formData.id) {
      let alarmConfigList: AlarmConfig[] = [];
      alarmConfigList.push(this.formData);
      this.alarmConfigWithAsset = {
        alarmConfigs: alarmConfigList,
        entity: JSON.stringify(this.assetResponse)
      }
      this.analogTagService.saveAlarmConfigForAnalogAssetTag(this.alarmConfigWithAsset).subscribe(res => {
        this.showLoaderImage = false;
        this.tabName.emit(true);
        this.modelNotification.alertMessage(res['messageType'], res['message']);
        this.loadFormData();
      }, error => {
        this.showLoaderImage = false;
        // this.tabName.emit(true);
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
    } else {
      this.formData.updatedBy = userId;
      this.analogTagService.updateAlarmConfigForAnalogAssetTag(this.formData).subscribe(res => {
        if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
          this.navigateTemplate.emit('alarmConfigList');
        } else {
          this.loadFormData();
        }
        this.showLoaderImage = false;
        this.tabName.emit(true);
        this.modelNotification.alertMessage(res['messageType'], res['message']);
      }, error => {
        this.showLoaderImage = false;
        // this.tabName.emit(true);
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
    }
    this.alarmFormPreview = false;
    this.alarmForm = true;
  }
  // For tab navigate
  @Output() tabName = new EventEmitter();
  backButton() {
    this.patchDate();
    this.alarmFormPreview = false;
    this.alarmForm = true;
    this.tabName.emit(false);
  }

  alertRedirection() {
    if (this.warningFlag == "reset") {
      this.globalService.GettingString('manageTags');
      //this.globalService.setOrganizationDetail("", this.assetTemplateDetail);;
      this.navigateTemplate.emit('manageAnalogAlarm');
      this.formResetConfirm();
    } else if (this.warningFlag == "cancel") {
      this.globalService.GettingString('manageTags');
      //this.globalService.setOrganizationDetail("", this.assetTemplateDetail);;
      this.navigateTemplate.emit('manageAnalogAlarmList');
      this.formCancelConfirm();
    }
    this.warningFlag = "";


  }



  cancelAnalogAlarmForm(event) {
    if (this.analogAlarmForm.dirty) {
      this.warningFlag = "cancel";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
      this.sharedService.globalObject = null;
    } else {
      this.formCancelConfirm();
      this.sharedService.globalObject = null;
    }
  }

  // Confirm redirect to
  formCancelConfirm() {
    this.globalService.GettingString('manageTags');
    if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
      this.navigateTemplate.emit('alarmConfigList');
    } else {
      this.navigateTemplate.emit('manageAnalogAlarmList');
    }
    //this.globalService.setOrganizationDetail("", this.assetTemplateDetail);;
    this.tabName.emit(true);
  }

  resetAlarmConfigForm() {
    if (this.analogAlarmForm.dirty) {
      this.warningFlag = "reset";
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'You will not be able to recover the changes!');
    }
  }

  redirectTo() {
    this.globalService.GettingString('manageTags');
    this.sharedService.analogAsset(this.analogAssetTag);
    this.navigateTemplate.emit('manageAnalogAlarmList');
  }
  // Form reset  confirm
  formResetConfirm() {
    if (this.analogAssetTag.id != null) {
      this.sharedService.analogAsset(this.analogAssetTag);
      this.loadFormData();
    } else {
      this.loadFormData();
    }
  }

  textBoxData: string = '';
  onlyDecimalNumberKey(event) {
    this.textBoxData = this.textBoxData + event.key
    const regex = /^[+-]?([0-9]*[.])?[0-9]+$/g
    if (regex.test(this.textBoxData)) {
      this.numberError = false;
    } else {
      this.numberError = true;
    }
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      // this.numberError = true;
      return
    } else {
      this.numberError = false;
    }
  }

  sectionEnableDisable(event, index) {
    let value = this.analogAlarmForm.get('alarmNotificationConfigs')['controls'][index];
    let notificationGroupId = value.controls['notificationGroupId'].value;
    let states = value.get('alarmStateNotificationConfigs')['controls'] as FormArray;
    if (event) {
      value.controls['alarmStateNotificationConfigs'].enable()
      for (let i = 0; i < states.length; i++) {
        states[i].get('isAssign').enable();
        states[i].get('notificationGroupId').disable();
        states[i].get('notificationGroupId').updateValueAndValidity();
        states[i].get('notificationRepeatIntervalSec').disable();
        states[i].get('notificationRepeatIntervalSec').updateValueAndValidity();
      }
      value.controls['notificationGroupId'].enable();
      value.controls['notificationGroupId'].setValidators([Validators.required]);
      value.controls['notificationGroupId'].updateValueAndValidity();
    } else {
      value.controls['notificationGroupId'].setValue(null);
      for (let i = 0; i < states.length; i++) {
        states[i].get('isAssign').disable();
        states[i].get('isAssign').setValue(false);
        states[i].get('notificationGroupId').disable();
        states[i].get('notificationGroupId').setValue(null);
        states[i].get('notificationRepeatIntervalSec').disable();
        states[i].get('notificationRepeatIntervalSec').setValue(null);
      }
      value.controls['notificationGroupId'].disable();
      value.controls['alarmStateNotificationConfigs'].disable();
      value.controls['notificationGroupId'].clearValidators();
      value.controls['notificationGroupId'].updateValueAndValidity();

    }
  }


  enableDisableState(event, index, i) {
    let value = this.analogAlarmForm.get('alarmNotificationConfigs')['controls'][index];
    let notificationGroupId = value.controls['notificationGroupId'].value;
    let state = value.get('alarmStateNotificationConfigs')['controls'][i];
    if (event) {
      state.get('notificationGroupId').enable();
      state.get('notificationRepeatIntervalSec').enable();
      state.get('notificationRepeatIntervalSec').setValidators(Validators.pattern("[0-9]*"));
    } else {
      state.get('notificationGroupId').disable();
      state.get('notificationGroupId').setValue(null);
      state.get('notificationRepeatIntervalSec').disable();
      state.get('notificationRepeatIntervalSec').setValue(null);
    }
  }

  alarmMessage() {
    this.heading = 'Alarm Message Format'
    this.messageFormat = '<div class="sweatalert-help-block-message">' + 'This is the message where user receives through SMS or E-Mail when alarm gets raised.' +
      '<br/>Message can have following placeholder.' +
      '<br/><ul><li>{Asset Name}</li>' +
      '<li>{Asset Tag Name}</li>' +
      '<li>{Asset Tag Value}</li>' +
      '<li>{Alarm Threshold Value}</li></ul>' +
      'Example: If we are measuring the Asset Tag (Temperature) of a room (Room No. 501) for which alarming condition is 35 degree celsius ' +
      'and current temperature of room is 38 degree celsius then alarm message can be like: ' +
      '<br/>{Asset Tag Name} of {Asset Name} is {Asset Tag Value}  which is higher than threshold limit {Alarm Threshold Value}' +
      '<br/>which means' +

      '<br/>Temperature of Room No. 501 is 38 degree Celsius which is higher than threshold limit 35 degree Celsius.' + '</div>'
    //this.modelNotification.alertMessage(this.globalService.messageType_AlarmMessage, this.messageFormat);
    this.modelNotification.helpMessage(this.messageFormat);
  }

  alarmClearMessage() {
    this.heading = 'Clear Message Format'
    this.messageFormat = '<div class="sweatalert-help-block-message">' + 'This is the message which user receives through SMS or E-Mail when alarm gets cleared, along with the raised message.' +
      '</br>Message can have following placeholder.' +
      '<br/><ul><li>{Asset Name}</li>' +
      '<li>{Asset Tag Name}</li>' +
      '<li>{Asset Tag Value}</li>' +
      '<li>{Alarm Threshold Value}</li></ul>' +

      'Example: If alarm gets cleared for the Asset Tag(Temperature) of a room (Room No. 501) for which alarming condition is 35 degree celsius ' +
      'and current temperature of room is 34 degree celsius then alarm message can be like:' +
      '<br/>{Asset Tag Name} is {Asset Tag Value}' +
      '<br/>which means Temperature is 34 degree Celsius.' +
      '<br/>Alarm "Temperature of Room No. 501 is 38 degree Celsius which is higher than threshold limit 35 degree Celsius is Cleared" and "Temperature is 34 degree Celsius which is normal".' + '</div>'
    //this.modelNotification.alertMessage(this.globalService.messageType_ClearMessage, this.messageFormat);
    this.modelNotification.helpMessage(this.messageFormat);
  }
  addMinDateValue() {
    let validFromDate = this.fetchStartDateFromPicker();
    if (null != validFromDate) {
      let fullDate = validFromDate.split('/');

      let num = Number(fullDate[0]);
      fullDate[0] = (num+1).toString().padStart(2, '0')

      this.minDate =
      {
        day: parseInt(fullDate[0]),
        month: parseInt(fullDate[1]),
        year: parseInt(fullDate[2])
      }
    }
  }
  fetchStartDateFromPicker() {
    if (null != this.analogAlarmForm.value.validFromDate) {
      let newYrs = this.analogAlarmForm.value.validFromDate.year;
      let newDay = this.analogAlarmForm.value.validFromDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.analogAlarmForm.value.validFromDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let reqDate = newDay + '/' + newMon + '/' + newYrs;
      this.startDate = reqDate;
      return reqDate;
    }
  }
  validateFromDate() {
    let startDay = this.analogAlarmForm.value.validFromDate.day;
    let endDay = this.analogAlarmForm.value.validTillDate.day;
    if (startDay > endDay) {
      this.analogAlarmForm.patchValue({
        validFromDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
    let endMonth = this.analogAlarmForm.value.validTillDate.month;
    let startMonth = this.analogAlarmForm.value.validFromDate.month;
    if (endMonth > startMonth) {
      this.analogAlarmForm.patchValue({
        validFromDate: this.fetchStartDateFromPicker()
      }, { emitEvent: false });
    }
  }

  fetchEndDateFromPicker() {
    if (null != this.analogAlarmForm.value.validTillDate) {
      let newDay = this.analogAlarmForm.value.validTillDate.day;
      if (newDay <= 9) {
        newDay = '0' + newDay;
      }
      let newMon = this.analogAlarmForm.value.validTillDate.month;
      if (newMon <= 9) {
        newMon = '0' + newMon;
      }
      let newYrs = this.analogAlarmForm.value.validTillDate.year;
      let reqDate = newDay + '/' + newMon + '/' + newYrs;
      this.endDate = reqDate;
      return reqDate;
    }
  }
  validateFromStartFromEndDate() {
    let date = this.fetchEndDateFromPicker();
    if (null != date) {
      let fullDate = date.split('/');

      let num = Number(fullDate[0]);
      fullDate[0] = (num-1).toString().padStart(2, '0')

      this.validTillDay =
      {
        day: parseInt(fullDate[0]),
        month: parseInt(fullDate[1]),
        year: parseInt(fullDate[2]),
      }
      this.addMinDateValue();
    }
  }
  validateStartAndEndTime(id: any) {
    this.resetTimeValidationControls();
    let startDate = this.fetchStartDateFromPicker();
    let endDate = this.fetchEndDateFromPicker();
    this.validateTime = false;
    this.validateEndTime = false;
    if (startDate === endDate) {
      this.alarmPage = <any>this.analogAlarmForm.value;
      let startTime = this.alarmPage.startTime;
      let endTime = this.alarmPage.endTime;
      let strtHr, strtMin, endHr, endMin;
      if (startTime != null) {
        if (startTime.length != 0) {
          let startTimeArray = startTime.split(':')
          strtHr = parseInt(startTimeArray[0]);
          strtMin = parseInt(startTimeArray[1]);
        }
      }
      if (endTime != null) {
        if (endTime.length != 0) {
          let endTimeTimeArray = endTime.split(':')
          endHr = parseInt(endTimeTimeArray[0]);
          endMin = parseInt(endTimeTimeArray[1]);
        }
      }
      if (id == 'startTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateTime = true;
            this.analogAlarmForm.controls['startTime'].markAsTouched();
            this.analogAlarmForm.controls['startTime'].updateValueAndValidity();
            this.analogAlarmForm.controls['startTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateTime = true;
            this.analogAlarmForm.controls['startTime'].markAsTouched();
            this.analogAlarmForm.controls['startTime'].updateValueAndValidity();
            this.analogAlarmForm.controls['startTime'].setErrors({
              'required': true
            })
          }
        }
      }
      else if (id == 'endTime') {
        if (strtHr >= endHr) {
          if (strtMin >= endMin) {
            this.validateEndTime = true;
            this.analogAlarmForm.controls['endTime'].markAsTouched();
            this.analogAlarmForm.controls['endTime'].updateValueAndValidity();
            this.analogAlarmForm.controls['endTime'].setErrors({
              'required': true
            })
          } if (strtHr > endHr) {
            this.validateEndTime = true;
            this.analogAlarmForm.controls['endTime'].markAsTouched();
            this.analogAlarmForm.controls['endTime'].updateValueAndValidity();
            this.analogAlarmForm.controls['endTime'].setErrors({
              'required': true
            })
          }
        }
      }
    }
  }
  getMilliSeconds(startDate, endDate) {
    if (startDate != null) {
      let reqStartDate = startDate.year + '-' + startDate.month + '-' + startDate.day;
      this.startDateTime = Date.parse(reqStartDate);
    } else if (startDate == null) {
      this.startDateTime = null;
    }
    if (endDate != null) {
      let reqEndDate = endDate.year + '-' + endDate.month + '-' + endDate.day + ' ' + '23:59';
      this.endDateTime = Date.parse(reqEndDate);
    } else if (endDate == null) {
      this.endDateTime = null;
    }
    if (startDate == null && endDate == null) {
      this.startDateTime = null;
      this.endDateTime = null;
    }
  }
  patchDate() {
    if (this.analogAlarmForm.value.validFromDate != null) {
      this.analogAlarmForm.patchValue({
        validFromDate: this.editDateFormat(this.analogAlarmForm.value.validFromDate)
      })
    }

    if (this.analogAlarmForm.value.validTillDate != null) {
      this.analogAlarmForm.patchValue({
        validTillDate: this.editDateFormat(this.analogAlarmForm.value.validTillDate)
      })
    }
  }
  getDateFormat(date) {
    let reqStartDate = date;
    if (date.year != null && date.month != null && date.day != null) {
      reqStartDate = date.day + '/' + date.month + '/' + date.year;
    }
    let fullDate = reqStartDate.split('/');
    let dateFormat =
    {
      day: parseInt(fullDate[0]),
      month: parseInt(fullDate[1]),
      year: parseInt(fullDate[2])
    }
    return dateFormat;
  }
  resetTimeValidationControls() {
    if (this.analogAlarmForm.value.startTime != null) {
      if (!this.analogAlarmForm.controls['endTime'].value) {
        this.analogAlarmForm.controls["endTime"].setValidators([Validators.required]);
        this.analogAlarmForm.controls["endTime"].setValue(null);
        this.analogAlarmForm.controls["endTime"].markAsTouched();
        this.analogAlarmForm.controls["endTime"].updateValueAndValidity();
        this.analogAlarmForm.controls["endTime"].setErrors({
          'required': true
        })
      }
    }
  }
}
