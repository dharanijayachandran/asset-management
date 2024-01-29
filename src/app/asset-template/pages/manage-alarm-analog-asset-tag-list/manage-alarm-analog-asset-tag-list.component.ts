import { Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { AnalogTag } from '../../model/analogTag ';
import { AnalogTagService } from '../../services/analogTag/analog-tag.service';
import { AlarmConfig } from '../../model/AlarmConfig';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';

@Component({
  selector: 'app-manage-alarm-analog-asset-tag-list',
  templateUrl: './manage-alarm-analog-asset-tag-list.component.html',
  styleUrls: ['./manage-alarm-analog-asset-tag-list.component.css']
})
export class ManageAlarmAnalogAssetTagListComponent implements OnInit {

  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  alarmTypes: any[];
  alarmSeveritys: any[];
  alarmConfidId: any;
  NoRecordsFound: boolean;
  alarmStates: any[];
  sort;
  alarmSeveritysAlarmConfig: any[];
  alarmConfigTab: boolean;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  constructor(private formBuilder: FormBuilder, private assetSharedService: AssetSharedService, private analogTagService: AnalogTagService, private globalService: globalSharedService) { }
  dataSource: any;
  analogAssetTag: AnalogTag;
  analogAlarmForm: FormGroup;
  displayedColumns: string[] = ['sNo', 'name', 'alarmType', 'limit', 'severity', 'action'];
  @ViewChild(UIModalNotificationPage) modelNotification;
  @Output() navigateTemplate = new EventEmitter();
  warningFlag: string;
  assetTagId: number;
  alarmConfigs: any[];
  alarmConfig: AlarmConfig;
  formView = false;
  tableView = false;
  showLoaderImage = false;
  notificationGroupMedias: any[];
  notifcationMedias: any[];
  notifcationAndMediaGrps: any[] = [];
  notificationGroups: any[];
  ngOnInit(): void {
    if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
      this.formView = true;
      this.tableView = false;
      this.analogAssetTag = this.assetSharedService.analogAssetObj;
      this.assetTagId = this.analogAssetTag.id;
      this.validateForm();
      this.patchFormData();
      this.getAlarmStates();
      this.getNotificationMedia();
      this.analogAlarmForm.controls['assetTagName'].setValue(this.globalService.assetTagName);
    } else {
      this.tableView = true;
      this.formView = false;
      this.loadFormData();
    }
  }

  loadFormData() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.alarmTypeName.toLowerCase().includes(filter) || data.alarmConditionValue.toLowerCase().includes(filter) || data.severityName.toLowerCase().includes(filter);
    };
    this.getAlarmStates();
    this.showLoaderImage = true;
    this.analogAssetTag = this.assetSharedService.analogAssetObj;
    this.assetTagId = this.analogAssetTag.id;
    this.validateForm();
    this.patchFormData();
    this.getNotificationMedia();
  }

  patchFormData() {
    this.analogAlarmForm.patchValue({
      assetTagName: this.analogAssetTag.name
    })
  }
  validateForm() {
    this.analogAlarmForm = this.formBuilder.group({
      assetTagName: [''],
    })
  }


  getAlarmTypesForAnalog() {
    this.analogTagService.getAlarmTypesForAnalog().subscribe(res => {
      this.alarmTypes = res;
      this.getAlarmConfigsByOrgId();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  getAlarmSeveritys() {
    this.analogTagService.getAlarmSeveritys().subscribe(res => {
      this.alarmSeveritys = res;
      this.getAlarmTypesForAnalog();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getAlarmSeveritysAlarmConfig() {
    this.analogTagService.getAlarmSeveritys().subscribe(res => {
      this.alarmSeveritysAlarmConfig = res;
      if (null != this.globalService.clickToViewData.alarmSevierity) {
        this.alarmSeveritysAlarmConfig.forEach(severity => {
          if (this.globalService.clickToViewData.alarmSevierity == severity.id) {
            this.alarmConfig.severityName = severity.name;
          }
        })
      }
    })
  }

  getAlarmConfigsByOrgId() {
    let beId = parseInt(sessionStorage.getItem('beId'));
    this.analogTagService.getNotioficationConfigsByOrgId(beId, this.assetTagId, null, null).subscribe(data => {
      this.showLoaderImage = false;
      this.alarmConfigs = data;
      if (null != this.alarmConfigs && this.alarmConfigs.length != 0) {
        this.alarmConfigs.forEach(config => {
          this.alarmSeveritys.forEach(severity => {
            if (config.alarmSevierity == severity.id) {
              config.severityName = severity.name;
            }
          })
          this.alarmTypes.forEach(type => {
            if (config.alarmTypeId == type.id) {
              config.alarmTypeName = type.name;
            }
          })
        })
        this.alarmConfigs = this.alarmConfigs.sort((a, b) => b.id - a.id);
        this.dataSource.data = this.alarmConfigs;
        // To get paginator events from child mat-table-paginator to access its properties
        this.myPaginator = this.myPaginatorChildComponent.getDatasource();
        this.matTablePaginator(this.myPaginator);

        this.dataSource.paginator = this.myPaginator;
        this.dataSource.sort = this.sort;

        this.NoRecordsFound = false;
      } else {
        this.NoRecordsFound = true;
      }
    },
      error => {
        this.showLoaderImage = false;
        this.NoRecordsFound = true;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  addAlarmConfig() {
    this.assetSharedService.analogAsset(this.analogAssetTag);
    this.navigateTemplate.emit('manageAnalogAlarm');
    this.tabName.emit(false);
  }
  // For tab navigate
  @Output() tabName = new EventEmitter();
  updateAlarmConfig(alarmConfig) {
    this.assetSharedService.analogAsset(this.analogAssetTag);
    this.navigateTemplate.emit('manageAnalogAlarm');
    this.assetSharedService.setGlobalObject(alarmConfig);
    this.tabName.emit(false);
  }
  getAlarmStates() {
    this.analogTagService.getAlarmStates().subscribe(res => {
      if (null != res) {
        res = res.sort((a, b) => a.id - b.id);
      }
      this.alarmStates = res;
      this.getAlarmSeveritys();
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      }
    )
  }

  clickToView(element) {
    this.alarmConfig = element;
    if (null != this.alarmConfig.alarmNotificationConfigs) {
      this.alarmConfig.alarmNotificationConfigs.forEach(notifigConfig => {
        this.notifcationMedias.forEach(media => {
          if (media.id == notifigConfig.notificationMediaId) {
            notifigConfig.notificationMediaName = media.name;
          }
        })
        this.notifcationAndMediaGrps.forEach(medias => {
          medias.forEach(grp => {
            let id = notifigConfig.notificationGroupId;
            if (grp.notificationGroupId == id) {
              notifigConfig.notificationGroupName = grp.notificationGroup.name;
            }
          })
        })
        if (notifigConfig.alarmStateNotificationConfigs) {
          notifigConfig.alarmStateNotificationConfigs.forEach(state => {
            this.notifcationAndMediaGrps.forEach(medias => {
              medias.forEach(grp => {
                let id = state.notificationGroupId;
                if (grp.notificationGroupId == id) {
                  state.notificationGroupName = grp.notificationGroup.name;
                }
              })
            })
            this.alarmStates.forEach(aState => {
              if (aState.id == state.alarmState) {
                state.alarmStateName = aState.name;
              }
            })
          })
        }
      });
    }
    this.formView = true;
    this.tableView = false;
  }

  backButton() {
    this.tableView = true;
    this.formView = false;
    if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
      this.navigateTemplate.emit('alarmConfigList');
    } else {
      this.navigateTemplate.emit('manageAnalogAlarmList');
    }
  }

  refreshTableListFunction() {
    this.loadFormData()
  }

  deleteAlarmConfig(id) {
    this.alarmConfidId = id
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Limit Alarm!');
  }

  confirmDelete() {
    let userId = parseInt(sessionStorage.getItem('userId'));
    this.analogTagService.deleteAlarmConfig(this.alarmConfidId, userId).subscribe(res => {
      this.modelNotification.alertMessage(res['messageType'], res['message']);
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
            grpMedias.push(grpMedia);
          }
        })
        this.notifcationAndMediaGrps.push(grpMedias);
      })
      if (this.globalService.setTabNameToAlarmConfig == "alarmConfigList") {
        this.clickToView(this.globalService.clickToViewData);
        this.getAlarmSeveritysAlarmConfig();
      }
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  getNotificationMedia() {
    this.analogTagService.getNotificationMedia().subscribe(res => {
      this.notifcationMedias = res;
      this.notifcationMedias = this.notifcationMedias.sort((a, b) => a.id - b.id);
      this.getNotificationGroupByOrganizationId();
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

  backToAnalogTags() {
    this.assetSharedService.analogAsset(this.analogAssetTag);
    this.navigateTemplate.emit('analogTemplateTagList');

    // this.tabName.emit(false);
  }


  /*
    Material table paginator code starts here
  */
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;

  /*
      Material pagination getting pageIndex, pageSize, length through
      events(On change page, Next,Prev, Last, first) */
  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }


  /* Load table data always to the Top of the table
  when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  /*
    Material table paginator code ends here
  */
}
