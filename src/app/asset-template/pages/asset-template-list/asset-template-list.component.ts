import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AssetTemplateService } from '../../services/assetTemplate/asset-template.service';
import { AssetTemplate } from '../../model/assetTemplate';
import { AssetCategory } from '../../model/assetCategory';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { EngUnit } from '../../model/engUnit';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { GatewayService } from 'src/app/asset/services/gateway/gateway.service';
import { Gateway } from 'src/app/shared/model/gateway';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { AssetService } from 'src/app/asset/services/asset/asset.service';
import { AssetType } from '../../model/AssetType';
import { GeospatialObectType } from '../../model/GeospatialObectType';
import { RtDataSharingTopic } from '../../model/RtDataSharingTopic';


@Component({
  selector: 'app-asset-template-list',
  templateUrl: './asset-template-list.component.html',
  styleUrls: ['./asset-template-list.component.css']
})
export class AssetTemplateListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  gatewayList: Gateway[] = [];
  assetTypes: AssetType[] = [];
  confirmDeleteAssetTemplate: number;
  showLoaderImage: boolean;
  engUnits: EngUnit[];
  geospatialObjectTypes: GeospatialObectType[];
  assetCategory: AssetCategory[];
  rtDataSharingTopics: RtDataSharingTopic[] = [];
  assetTypeByCategoryMap = new Map<number,any[]>();
  assetTypeByCategory: any[]=[];
  constructor(private assetTemplateListService: AssetTemplateService, private assetService: AssetService,
    private globalService: globalSharedService, private gatewayService: GatewayService, private assetSharedService: AssetSharedService) { }
    public date= new Date();
  ngOnInit() {
    // To get all the records for asset template list
    this.getAssetTypes();
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.assetTypeName.toLowerCase().includes(filter) || data.gatewayTemplateName.toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    this.getGeospatialObjectTypes();
   // this.getAssetCategoryList();
    this.getEngUnits();
    this.getAllGateways();
    this.getRtDataSharingTopics();
  }

  // Refresh table
  refreshTableListFunction() {
    this.showLoaderImage = true;
    this.getGeospatialObjectTypes();
    this.getAssetCategoryList();
    this.getAssetTypes();
    this.getEngUnits();
    this.getAllGateways();
  }

  displayedColumns: string[] = ['id', 'name', 'assetTypeName', 'gatewayTemplateName', 'action'];
  displayTableHeader = ['S.No.', 'Name', 'Asset Type', 'Gateway Template'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource: any;

  // To get all the records for asset template list
  getAssetTemplateList() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetTemplateListService.getAssetTemplateList(Number(organizationId)).subscribe(
      res => {
        let assetTemplateList: AssetTemplate[] = [];
        if (Array.isArray(res) && res.length) {
          assetTemplateList = res;
          let getDataSource = this.formatedResponce(assetTemplateList);
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.dataSource.data = getDataSource;
          // To get paginator events from child mat-table-paginator to access its properties
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.matTablePaginator(this.myPaginator);

          this.showLoaderImage = false;
          this.dataSource.paginator = this.myPaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = res;
          this.showLoaderImage = false;
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);

      });
  }

  @Output() navigateTemplate = new EventEmitter();
  addAssetTemplate() {
    this.globalService.listOfRow = {};
    this.navigateTemplate.emit('templateFormView');
  }


  @Output() tabName = new EventEmitter<string>();

  // Genarate Asset Tag
  generateAssetTags(assetTemplateDetail) {
    let assetTemplateName = assetTemplateDetail.name;
    this.globalService.gettingName(assetTemplateName);
    this.assetTemplateObject(assetTemplateDetail);
    this.navigateTemplate.emit('generateAssetTags');
    this.tabName.emit('manageTags');
    let manageTags = document.getElementById('manageTags');
    manageTags.click();
  }

  // Manage Asset tags
  manageAssetTags(assetTemplateDetail) {
    this.assetTemplateObject(assetTemplateDetail);
    this.tabName.emit('manageTags');
    this.navigateTemplate.emit('manageAssetTags');
    let manageTags = document.getElementById('manageTags');
    manageTags.click();
  }

  // Click to View
  clickToView(assetTemplateDetail) {
    if (assetTemplateDetail.assetParams) {
      this.engUnits.forEach(unit => {
        assetTemplateDetail.assetParams.forEach(param => {
          if (unit.id == param.engUnitId) {
            param.engUnitName = unit.name;
          }
        })
      })
    }
    this.assetTemplateObject(assetTemplateDetail);
    this.navigateTemplate.emit('templateView');
  }
  // Update  Asset Template
  updateAssetTemplate(assetTemplateDetail) {
    this.assetTemplateObject(assetTemplateDetail);
    this.navigateTemplate.emit('templateFormView');
  }
  formatedResponce(assetTemplateList: AssetTemplate[]) {
    assetTemplateList.forEach(e => {
      for (let e1 of this.gatewayList) {
        if (e1.id == e.gateWayTemplateId) {
          e.gatewayTemplateName = e1.name;
          break;
        }
        else {
          e.gatewayTemplateName = ""
        }
      }
    });
    assetTemplateList.forEach(e => {
      for (let e1 of this.assetTypes) {
        if (e1.id == e.typeId) {
          e.assetTypeName = e1.name;
          break;
        }
        else {
          e.assetTypeName = ""
        }
      }
    });
    assetTemplateList.forEach(e => {
      for (let geospatialObjectType of this.geospatialObjectTypes) {
        if (geospatialObjectType.id == e.geospatialObjectType) {
          e.geospatialObjectTypeName = geospatialObjectType.name;
          break;
        } else {
          e.geospatialObjectTypeName = '';
        }
      }
    });
    assetTemplateList.forEach(e => {
      for (let e1 of this.assetCategory) {
        if (e1.id == e.assetCategoryId) {
          e.assetCategoryName = e1.name;
          break;
        }
        else {
          e.assetCategoryName = ""
        }
      }
    });

    return assetTemplateList;
  }

  getAllGateways() {
     this.gatewayService.getGateways().subscribe(
      res => {
        this.gatewayList = res.filter(element => element.isTemplate == true);
        this.getAssetTemplateList();
        this.globalService.setOrganizationDetail("", this.gatewayList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  // Get all Asset Type List
  getAssetTypes() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetService.getAccessTypeByOrganizationId(Number(organizationId)).subscribe(data => {
      // data = data.sort((a, b) => a.name.localeCompare(b.name))
      this.assetTypes = data;
      this.getAssetCategoryList();
      this.assetSharedService.setAssetTypes(this.assetTypes);
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  // Common function for setting ID and asset object
  assetTemplateObject(assetTemplateDetail) {
    this.globalService.GettingId(assetTemplateDetail.id);
    this.globalService.setOrganizationDetail('', assetTemplateDetail);
    this.globalService.analogAsset(assetTemplateDetail)
  }
  setAssetTypeByAssetCategoryId(assetCategoryId: any) {
    this.assetTypes.forEach(assetType => {
      if (assetType.assetCategoryId == assetCategoryId) {
        this.assetTypeByCategory.push(assetType);
      }
    })
    this.assetTypeByCategoryMap.set(assetCategoryId,this.assetTypeByCategory);
  }

  deleteAssetTemplate(id: number) {
    this.confirmDeleteAssetTemplate = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Template!');
  }

  // confirmDelete
  confirmDelete() {
    this.showLoaderImage = true;
    let userId = sessionStorage.getItem('userId');
    this.assetTemplateListService.deleteAssetTemplate(this.confirmDeleteAssetTemplate, Number(userId)).subscribe(res => {
      // Success response
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error: any) => {
      // If the service is not available
      this.showLoaderImage = false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
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



  /*
  Download as Excel, PDF, CSV starts here=================================
*/

  // Getting search filter details
  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "Search Criteria";
  exportedFileTitleName = "Asset Template List";
  tableBodyDataList;
  fileName: string;

  xlsxOptions = {
    headers: this.displayTableHeader
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Asset Template List',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };

  downloadFile(fileType) {

    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);

    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }

    // Make new set of re-create object
    this.tableBodyDataList = this.globalService.reCreateNewObject(this.dataSource.data, this.displayedColumns);

    // S.No.
    this.tableBodyDataList = this.globalService.serialNumberGenerate(this.tableBodyDataList);

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => {
      return this.globalService.removeLastIndexAtArray(object);
    });

    // CSV/PDF/Excel file name
    this.fileName = this.globalService.getExportingFileName("Asset Template");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    // Final download
    this.globalService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);
  }

  /*
  Download as Excel, PDF, CSV ends here=================================
  */


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
  //Get getGeospatialObjectTypes
  getGeospatialObjectTypes() {
    this.assetTemplateListService.getGeospatialObjectTypes().subscribe(data => {
      this.geospatialObjectTypes = data;
    },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      })
  }

  // Get all Asset Category List
  getAssetCategoryList() {
    this.assetTemplateListService.getAssetCategoryList().subscribe(
      res => {
        this.assetCategory = res;
        this.assetCategory.forEach(category=>{
          this.assetTypeByCategory=[];
          this.setAssetTypeByAssetCategoryId(Number(category.id));
        })
        this.globalService.setAssetTypeByAssetCategoryId(this.assetTypeByCategoryMap);
        this.assetSharedService.setAssetCategoryDetails(this.assetCategory);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        //
      });
  }

  getRtDataSharingTopics() {
    let organizationId = sessionStorage.getItem("beId");
    this.assetTemplateListService.getRtDataSharingTopics(organizationId).subscribe(
      res => {
        res.forEach(element => {
          let rtDataSharingTopic: RtDataSharingTopic = new RtDataSharingTopic();
          rtDataSharingTopic.name = element;
          this.rtDataSharingTopics.push(rtDataSharingTopic);
        });
        this.globalService.setRtDataSharingTopics(this.rtDataSharingTopics);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

}
