import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Asset } from 'src/app/shared/model/asset';
import { AssetTag } from '../../model/assetTag';
import { AssetTagDiscreteState } from '../../model/assetTagDiscrete';
import { DiscreteState } from '../../model/discreteState';
import { AssetSharedService } from '../../services/asset-shared-service/asset-shared.service';
import { DiscreteTagService } from '../../services/discreteTag/discrete-tag.service';

@Component({
  selector: 'app-discrete-tag-list',
  templateUrl: './discrete-tag-list.component.html',
  styleUrls: ['./discrete-tag-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DiscreteTagListComponent implements OnInit {

  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;


  discreteState: DiscreteState[] = [];
  assetTagDiscreteState: AssetTagDiscreteState[] = [];
  displayedColumns: string[] = ['id', 'sNo', 'name', 'isInputEnabled', 'isOutputEnabled', 'state', 'action'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Mat sorting for if use ngIf condition to show table starts here======================
  sort;
  discreteAssetId: number;
  template: Asset;
  showLoaderImage = false;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  // Mat sorting for if use ngIf condition to show table ends here======================

  dataSource: any;
  assetTemplateDetail: any;
  assetId: any;
  backId: any;
  assetTemplateId: any;
  gateWayTemplateId: any;

  constructor(private discreteTagService: DiscreteTagService, private globalService: globalSharedService, private assetSharedService: AssetSharedService) { }

  ngOnInit() {
    // To get all Asset Tag list
    this.dataSource = new MatTableDataSource();
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.isInputEnabledString.toLowerCase().includes(filter) || data.isOutputEnabledString.toLowerCase().includes(filter) || data.assetTagDiscreteStates.toString().toLowerCase().includes(filter);
    };
    this.showLoaderImage = true;
    //  this.assetTagDiscreteStates();
    // this.discreteStates()
    this.getDiscreteTags();
  }
  getDiscreteTags() {
    this.assetTemplateDetail = this.globalService.listOfRow;
    this.template = this.globalService.analogAssetObj;
    this.assetId = this.assetTemplateDetail.id
    this.gateWayTemplateId = this.assetTemplateDetail.gateWayTemplateId;
    if (this.assetId != null) {
      this.discreteTags(this.assetId, this.gateWayTemplateId);
    }
    else {
      this.backId = this.assetTemplateDetail.assetId;
      this.discreteTags(this.backId, this.gateWayTemplateId);
    }
  }
  // Refresh table
  refreshTableListFunction() {
    // To get all Asset Tag list
    this.showLoaderImage=true;
    if (this.dataSource) {
      this.dataSource.data = [];
    }
    //this.assetTagDiscreteStates();
    // this.discreteStates()
    this.getDiscreteTags();
  }
  discreteTags(assetId: number, gatewayTemplateId: number) {
    this.discreteTagService.getDiscreteTagList(assetId, gatewayTemplateId).subscribe(
      res => {
        if ((Array.isArray(res) && res.length) && res != null) {
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
          // this.formatDiscreteTagsList(res);
          res.forEach(e => {
            e.assetTagDiscreteState.sort((a, b) => a.id - b.id);
          })
          let getDataSource = res;
          this.formatedResponce(getDataSource);
          getDataSource = getDataSource.sort((a, b) => b.id - a.id);
          this.dataSource.data = getDataSource;
          this.showLoaderImage = false;

          // To get paginator events from child mat-table-paginator to access its properties
          this.myPaginator = this.myPaginatorChildComponent.getDatasource();
          this.matTablePaginator(this.myPaginator);

          this.dataSource.paginator = this.myPaginator;
          this.dataSource.sort = this.sort;
        } else {
          this.dataSource = new MatTableDataSource();
          this.dataSource.data = [];
          this.showLoaderImage = false;

        }
      },
      error => (error: any) => {
        this.showLoaderImage = false;
        // If the service is not available
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  formatedResponce(discreteTagList) {
    discreteTagList.forEach(e => {
      e.orgAssetStandardTagId = e.orgAssetStandardTagId;
      let assetTagDiscreteStates = [];
      for (let e1 of e.assetTagDiscreteState) {
        assetTagDiscreteStates.push(" " + e1.name);
      }
      e.assetTagDiscreteStates = assetTagDiscreteStates;
    });
  }
  discreteStates() {
    this.discreteTagService.discreteStates().subscribe(
      res => {
        if (res != null) {
          this.discreteState = res;
          this.discreteState = this.discreteState.sort((a, b) => a.id - b.id);
          this.assetSharedService.setAssetDiscreteStateDetails(this.discreteState);
        }
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  assetTagDiscreteStates() {
    this.discreteTagService.assetTagDiscreteStates().subscribe(
      res => {
        if (res != null) {
          if (Array.isArray(res) && res.length) {
            this.assetTagDiscreteState = res;
            this.assetTagDiscreteState = this.assetTagDiscreteState.sort((a, b) => a.id - b.id);
            this.assetSharedService.setAssetTagDiscreteState(this.assetTagDiscreteState);

          }
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  // Add analog Tag
  @Output() navigateTemplate = new EventEmitter();
  addAssetTag() {
    //this.globalService.GettingId(this.assetId);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
    this.assetSharedService.analogAssetObj = {};
    this.navigateTemplate.emit('discreteTemplateForm');
    this.tabName.emit(false);
  }

  manageDiscreteAssetTagIO(assetTagDiscreteDetail) {
    this.assetDiscreteObject(assetTagDiscreteDetail);
    this.navigateTemplate.emit('manageDiscreteTagForm');
    this.tabName.emit(false);
  }

  // Click to View
  clickToView(assetTagDiscreteDetail) {
    this.assetDiscreteObject(assetTagDiscreteDetail);
    this.navigateTemplate.emit('discreteTagView');
  }
  // Common function for setting ID and assetDiscreteObject
  assetDiscreteObject(assetTagDiscreteDetail) {
    this.assetSharedService.GetId(assetTagDiscreteDetail.id);
    this.assetSharedService.analogAsset(assetTagDiscreteDetail);
    this.globalService.setOrganizationDetail('', this.assetTemplateDetail);
  }
  // Update
  // For tab navigate
  @Output() tabName = new EventEmitter();
  updateDiscreteTag(discreteTagDetail) {
    this.discreteTagObject(discreteTagDetail);
    this.globalService.GettingId(this.assetTemplateDetail.id)
    this.globalService.GettingString(this.assetTemplateDetail.name)
    this.navigateTemplate.emit('discreteTemplateForm');
    this.tabName.emit(false);
  }

  // Common function for setting ID and assetDiscreteObject
  discreteTagObject(discreteTagDetail) {
    this.assetSharedService.GetId(discreteTagDetail.id);
    this.assetSharedService.analogAsset(discreteTagDetail);
  }

  manageAlarmDiscreteAssetTag(discreteTagDetail: AssetTag) {
    this.assetSharedService.GetId(discreteTagDetail.id);
    discreteTagDetail.assetTemplateName = this.template.name
    this.assetSharedService.analogAsset(discreteTagDetail);
    this.navigateTemplate.emit('manageAlarmDiscreteTagList');
  }

  deleteDiscreteAssetTag(id: number) {
    this.discreteAssetId = id;
    // Trigger sweet alert danger alert
    this.modelNotification.alertMessage(this.globalService.messageType_Error, 'You will not be able to recover this Asset Tag!');
  }

  // confirmDelete
  confirmDelete() {
    this.showLoaderImage=true;
    let userId = sessionStorage.getItem('userId');
    this.discreteTagService.deleteDiscreteAssetTag(this.discreteAssetId, Number(userId)).subscribe(res => {
      // Success response
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(res['messageType'], res['message']);
    }, (error) => {
      // If the service is not available
      this.showLoaderImage=false;
      this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
    })
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
