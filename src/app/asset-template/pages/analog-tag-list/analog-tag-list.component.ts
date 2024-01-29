import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Asset } from 'src/app/shared/model/asset';
import { AnalogTag } from '../../model/analogTag ';
import { AssetStandardTag } from '../../model/AssetStandardTag';
import { DataType } from '../../model/dataType';
import { EngUnit } from '../../model/engUnit';
import { AnalogTagService } from '../../services/analogTag/analog-tag.service';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { AssetService } from 'src/app/asset/services/asset/asset.service';
import { AssetType } from '../../model/AssetType';
import { AssetTagService } from '../../services/assetTag/asset-tag.service';

@Component({
  selector: 'app-analog-tag-list',
  templateUrl: './analog-tag-list.component.html',
  styleUrls: ['./analog-tag-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AnalogTagListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  displayedColumns: string[] = ['id', 'sNo', 'name', 'dataTypeId', 'engUnitId', 'isInputEnabled', 'isOutputEnabled', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataTypeList: DataType[];
  unitIdList: EngUnit[];

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  analogAssetId: number;
  assetTypes:AssetType[]=[];
  showLoaderImage: boolean = false;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================
  assetStandardTags: AssetStandardTag[];
  dataSource: any;
  assetTemplateDetail: any;
  assetId: any;
  backId: any;
  assetTemplateId: any;
  gateWayTemplateId: any;
  assetTempalte: Asset;
  constructor(private analogTagService: AnalogTagService, private globalService: globalSharedService, private assetSharedService: AssetSharedService,private assetTagService: AssetTagService,) { }

  ngOnInit() {
    let organizationId = sessionStorage.getItem("beId");
    // To get all Asset Tag list
    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.dataTypeIdList();
    this.getUnitList();
    this.getStandardTagsByBId(organizationId);
    this.GetAanalogTags();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.dataTypeName.toLowerCase().includes(filter) || data.engUnitName.toLowerCase().includes(filter) || data.isInputEnabledString.toLowerCase().includes(filter) || data.isOutputEnabledString.toLowerCase().includes(filter);
    };

  }

  GetAanalogTags() {
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.assetId = this.assetTemplateDetail.id
    if (this.assetId != null) {
      this.getAanalogTags(this.assetId);
    }
    else {
      this.backId = this.assetTemplateDetail.assetId;
      this.getAanalogTags(this.backId);
    }
    this.assetTempalte = this.globalService.analogAssetObj;
  }

  // Refresh table
  refreshTableListFunction() {
    // To get all Asset Tag list
    this.showLoaderImage=true;
    let organizationId = sessionStorage.getItem("beId");
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    this.dataTypeIdList();
    this.getUnitList();
    this.GetAanalogTags();
    this.getStandardTagsByBId(organizationId);
  }


  getAanalogTags(assetId: number) {
    this.analogTagService.getAnalogTagList(assetId).subscribe(
      res => {
        let getDataSource = res;
        if (Array.isArray(res) && res.length) {
          res.forEach(tag => {
            if (tag.isInputEnabled) {
              tag.isInputEnabledString = 'Yes'
            } else {
              tag.isInputEnabledString = 'No'
            } if (tag.isOutputEnabled) {
              tag.isOutputEnabledString = 'Yes'
            } else {
              tag.isOutputEnabledString = 'No'
            }
          })
          getDataSource = this.formatedResponse(getDataSource);
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.showLoaderImage = false;
          this.dataSource.data = getDataSource;

          // To get paginator events from child mat-table-paginator to access its properties
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.matTablePaginator(this.myPaginator);

          this.dataSource.paginator = this.myPaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = res;
          this.showLoaderImage = false;

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  formatedResponse(analogList: AnalogTag[]) {
    analogList.forEach(e => {
      if (this.dataTypeList) {
        for (let e1 of this.dataTypeList) {
          if (e1.id == e.dataTypeId) {
            e.dataTypeName = e1.name;
            break;
          }
          else {
            e.dataTypeName = ""
          }
        }
      }
    });
    analogList.forEach(e => {
      if (this.unitIdList) {
        for (let e1 of this.unitIdList) {
          if (e1.id == e.engUnitId) {
            e.engUnitName = e1.name;
            break;
          }
          else {
            e.engUnitName = ""
          }
        }
      }
    });
    if (this.assetStandardTags) {
      this.assetStandardTags.forEach(e => {
        analogList.forEach(e1 => {
          if (e.id == e1.orgAssetStandardTagId) {
            e1.orgAssetStandardTagName = e.name
          }
        });
      });
    }
    return analogList;
  }

  // Click to View
  clickToView(assetTemplateAnalogDetail) {
    this.assetTemplateAnalogObject(assetTemplateAnalogDetail);
    this.navigateTemplate.emit('assetTemplateView');
  }

  // Click to Manage Alarm
  clickToManageAlarm(assetTemplateAnalogDetail) {
    assetTemplateAnalogDetail.assetTemplateName = this.assetTempalte.name;
    this.assetTemplateAnalogObject(assetTemplateAnalogDetail);
    this.navigateTemplate.emit('manageAnalogAlarmList');
  }

  // Common function for setting ID and role object
  assetTemplateAnalogObject(assetTemplateAnalogDetail) {
    this.assetSharedService.GetId(assetTemplateAnalogDetail.id);
    this.assetSharedService.analogAsset(assetTemplateAnalogDetail);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
  }
  // Add analog Tag
  @Output() navigateTemplate = new EventEmitter();
  addAssetTag() {
    //this.globalService.GettingId(this.assetId);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
    this.assetSharedService.analogAssetObj = {};
    this.navigateTemplate.emit('analogTemplateFormView');
    this.tabName.emit(false);
  }

  // For tab navigate
  @Output() tabName = new EventEmitter();

  // Update
  updateAnalogAssetTemplate(analogAssetTemplateDetail) {
    this.analogAssetTemplateObject(analogAssetTemplateDetail);
    this.globalService.GettingId(this.assetTemplateDetail.id)
    this.globalService.GettingString(this.assetTemplateDetail.name)
    this.navigateTemplate.emit('analogTemplateFormView');

    this.tabName.emit(false);
  }

  // Common function for setting ID and role object
  analogAssetTemplateObject(analogAssetTemplateDetail) {
    this.assetSharedService.GetId(analogAssetTemplateDetail.id);
    this.assetSharedService.analogAsset(analogAssetTemplateDetail);
  }

  // To get all data Type list for drop down
  dataTypeIdList() {
    this.analogTagService.getDataTypes().subscribe(
      res => {
        this.dataTypeList = res;
        this.assetSharedService.setDataTypeList(this.dataTypeList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  // To get all Unit Id list for drop down
  getUnitList() {
    this.analogTagService.getEnggUnits().subscribe(
      res => {
        this.unitIdList = res;
        this.unitIdList= this.globalService.addSelectIntoList(this.unitIdList);
        this.assetSharedService.setEngUnitList(this.unitIdList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  getStandardTagsByBId(organizationId: string) {
    this.assetTagService.getStandardTagsByBId(Number(organizationId)).subscribe(data => {
      data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.assetStandardTags = data;
      this.assetStandardTags= this.globalService.addSelectIntoList(this.assetStandardTags);
      this.assetSharedService.setAssetStandardTagList(this.assetStandardTags);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }



  deleteAnalogAssetTag(id: number) {
    this.analogAssetId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Tag!');
  }

  // confirmDelete
  confirmDelete() {
    this.showLoaderImage=true;
    let userId = sessionStorage.getItem('userId');
    this.analogTagService.deleteAnalogAssetTag(this.analogAssetId, Number(userId)).subscribe(res => {
      // Success response
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      // If the service is not available
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
  }

  manageAlarm(element: any) {
    this.assetSharedService.analogAsset(element);
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
