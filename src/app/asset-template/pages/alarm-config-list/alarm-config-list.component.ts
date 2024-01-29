import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { AlarmConfig } from '../../model/AlarmConfig';
import { AlarmConfigService } from '../../services/alarm-config.service';
import { AnalogTagService } from '../../services/analogTag/analog-tag.service';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { AnalogTag } from '../../model/analogTag ';

@Component({
  selector: 'asset-management-alarm-config-list',
  templateUrl: './alarm-config-list.component.html',
  styleUrls: ['./alarm-config-list.component.css']
})
export class AlarmConfigListComponent implements OnInit {
  dataSource;
  displayedColumns: string[] = ['id', 'tagName', 'tagType', 'alarmName', 'alarmType', 'alarmConditionValue', 'action'];
  alarmConfig: AlarmConfig;
  notifcationMedias: any[];
  notifcationAndMediaGrps: any[] = [];
  alarmStates: any[];
  formView = false;
  assetTemplateDetail: any;
  deleteAlarmConfigById: number;
  showLoaderImage: boolean;
  assetId: number;
  noRecordsFound: boolean;
  @Output() navigateTemplate = new EventEmitter();
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  myPaginator;
  pageIndex: number;
  pageSize: number;
  length: number;
  analogAssetTag: AnalogTag;

  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;
  getStateNameAlarmConfig: any[];
  stateName: any;

  constructor(private analogTagService: AnalogTagService, private globalService: globalSharedService, private assetSharedService: AssetSharedService, private alarmConfigService: AlarmConfigService) { }
  @ViewChild(UIModalNotificationPage) modelNotification;

  ngOnInit(): void {
    this.noRecordsFound = false;
    this.dataSource = new MatTableDataSource();
    /*   this.dataSource.data = [
        { 'name': 'name1', 'alarmEntityName': 'analog' },
        { 'name': 'name2', 'alarmEntityName': 'discrete' },
      ]
    */
    this.showLoaderImage = true;
    this.analogAssetTag = this.assetSharedService.analogAssetObj;
    this.getAlarmConfig();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.alarmEntityName.toLowerCase().includes(filter) || data.name.toLowerCase().includes(filter);
    };
  }

  refreshTableListFunction() {
    this.ngOnInit();
  }

  getAlarmConfig() {
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.assetId = this.assetTemplateDetail.id;
    let organizationId = Number(sessionStorage.getItem('beId'));
    this.alarmConfigService.getAlarmConfig(this.assetId, organizationId).subscribe(response => {
      this.dataSource.data = response;
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
      this.showLoaderImage = false;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  // Click to View
  clickToView(assetTemplateAnalogDetail) {
    this.globalService.assetTagName = assetTemplateAnalogDetail.alarmEntityName;
    this.globalService.setViewData(assetTemplateAnalogDetail);
    if (assetTemplateAnalogDetail.alarmEntityTypeName === 'A') {
      this.navigateTemplate.emit('manageAnalogViewData');
    }
    else if (assetTemplateAnalogDetail.alarmEntityTypeName === 'D') {
      this.navigateTemplate.emit('manageDiscreteViewData');
      this.globalService.alarmConfigSetStateView = assetTemplateAnalogDetail.alarmConditionValue;
    }
  }

  // Common function for setting ID and role object
  assetTemplateAnalogObject(assetTemplateAnalogDetail: any) {
    this.assetSharedService.GetId(assetTemplateAnalogDetail.id);
    this.assetSharedService.analogAsset(assetTemplateAnalogDetail);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
  }

  assetDiscreteObject(assetTagDiscreteDetail: any) {
    this.assetSharedService.GetId(assetTagDiscreteDetail.id);
    this.assetSharedService.analogAsset(assetTagDiscreteDetail);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
  }

  // For tab navigate
  @Output() tabName = new EventEmitter();

  // Update
  updateAnalogAssetTemplate(assetTemplateDetail) {
    this.globalService.assetTagName = assetTemplateDetail.alarmEntityName;
    if (assetTemplateDetail.alarmEntityTypeName === 'A') {
      this.assetSharedService.analogAsset(this.analogAssetTag);
      this.navigateTemplate.emit('manageAnalogAlarm');
      this.assetSharedService.setGlobalObject(assetTemplateDetail);
      this.tabName.emit(false);
    } else if (assetTemplateDetail.alarmEntityTypeName === 'D') {
      this.assetSharedService.analogAsset(assetTemplateDetail);
      this.navigateTemplate.emit('manageAlarmDiscreteTag');
      this.assetSharedService.setGlobalObject(assetTemplateDetail);
      this.tabName.emit(false);
    }
  }

  // Common function for setting ID and role object
  analogAssetTemplateObject(analogAssetTemplateDetail) {
    this.assetSharedService.GetId(analogAssetTemplateDetail.id);
    this.assetSharedService.analogAsset(analogAssetTemplateDetail);
  }

  discreteTagObject(discreteTagDetail) {
    this.assetSharedService.GetId(discreteTagDetail.id);
    this.assetSharedService.analogAsset(discreteTagDetail);
  }

  deleteAlarmConfig(id: number) {
    this.deleteAlarmConfigById = id;
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover the Alarm config!');
  }

  confirmDelete() {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    this.alarmConfigService.deleteAlarmConfig(this.deleteAlarmConfigById, Number(userId)).subscribe(res => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
      this.ngOnInit();
    }, (error) => {
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  matTablePaginator(myPaginator) {
    this.pageIndex = myPaginator.pageIndex;
    this.pageSize = myPaginator.pageSize;
    this.length = myPaginator.length;
  }

  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

}
