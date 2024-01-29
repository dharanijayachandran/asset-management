import { FormBuilder, FormGroup } from '@angular/forms';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DataType } from '../../../asset-template/model/dataType';
import { EngUnit } from '../../../asset-template/model/engUnit';
import { AssetSharedService } from '../../../asset-template/services/asset-shared-service/asset-shared.service';
import { AnalogTagService } from '../../../asset-template/services/analogTag/analog-tag.service';
import { MatTablePaginatorComponent } from 'src/app/shared/components/mat-table-paginator/mat-table-paginator.component';
import { ScrollbarDirective, UIModalNotificationPage } from 'global';
import { AssetService } from '../../services/asset/asset.service';

@Component({
  selector: 'app-download-asset-tags',
  templateUrl: './download-asset-tags.component.html',
  styleUrls: ['./download-asset-tags.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DownloadAssetTagsComponent implements OnInit {
  asset: any;
  analogAlarmForm: FormGroup;
  // Importing child component to
  @ViewChild(UIModalNotificationPage) modelNotification;
  @ViewChild('myPaginatorChildComponent') myPaginatorChildComponent: MatTablePaginatorComponent;
  @ViewChild(ScrollbarDirective) directiveRef?: ScrollbarDirective;

  displayedColumns: string[] = ['select', 'name', 'id', 'tagTypeName', 'dataTypeName', 'engUnitName', 'isInputEnabledString', 'isOutputEnabledString'];
  downloadColumns: string[] = ['sNo', 'name', 'id', 'tagTypeName', 'dataTypeName', 'engUnitName', 'isInputEnabledString', 'isOutputEnabledString'];
  displayTableHeader = ['S.No.', 'Name', 'Asset Tag Id', 'Tag Type', 'Data Type', 'Engineering Unit', 'Input Enabled', 'Output Enabled'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataTypeList: DataType[];
  unitIdList: EngUnit[];
  assetId: any;
  NoRecordsFound = false;
  @Output() navigateTemplate = new EventEmitter();
  tagTypes: { id: string; name: string; }[];
  totalResponse: any[];
  checkBoxToolTip: string = "Select All";
  selection = new SelectionModel<any>(true, []);
  constructor(private globalService: globalSharedService, private formBuilder: FormBuilder,
    private assetSharedService: AssetSharedService, private analogTagService: AnalogTagService
    , private assetService: AssetService) { }
  showLoaderImage: boolean = false;
  dataSource: any;
  sort: any;
  _confirmed = false;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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


  searchFilterObject = {};
  searchFieldsContainer;
  searchFilterKeysValues
  searchCriteriaText = "";
  exportedFileTitleName = "Asset Tag List";
  tableBodyDataList;
  fileName: string;
  validForm = false;
  xlsxOptions = {
    headers: this.displayTableHeader
  }
  ngOnInit() {
    this.asset = this.globalService.analogAssetObj;
    this.analogAlarmForm = this.formBuilder.group({
      assetName: [''],
      assetId: [],
      tagType: [null],
      engUnitId: [null],
      isInputEnabled: [false],
      isOutputEnabled: [false]
    })

    this.analogAlarmForm.patchValue({
      assetName: this.asset.name,
      assetId: this.asset.id
    })

    this.dataSource = new MatTableDataSource();
    this.showLoaderImage = true;
    this.dataTypeIdList();
    this.getUnitList();
    this.getAssetTags();
    this.tagTypes = [{ "id": "A", "name": "Analog" }, { "id": "D", "name": "Discrete" }]
    this.dataSource.filterPredicate = function (data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter) || data.dataTypeName.toLowerCase().includes(filter) || data.engUnitName.toLowerCase().includes(filter) || data.isInputEnabledString.toLowerCase().includes(filter) || data.isOutputEnabledString.toLowerCase().includes(filter);
    };
    this.analogAlarmForm.setErrors({ 'invalid': true });
  }


  validateTheForm() {
    let tagType = this.analogAlarmForm.controls['tagType'].value
    let engUnit = this.analogAlarmForm.controls['engUnitId'].value
    let inputEnabled = this.analogAlarmForm.controls['isInputEnabled'].value
    let outputEnabled = this.analogAlarmForm.controls['isOutputEnabled'].value
    if (tagType || engUnit || inputEnabled || outputEnabled) {
      this.analogAlarmForm.setErrors(null);
    } else {
      this.clearFilter()
    }
  }

  filterDataSource() {
    this.dataSource.data = [];
    this.showLoaderImage = true;
    let tagType = this.analogAlarmForm.controls['tagType'].value
    let engUnit = this.analogAlarmForm.controls['engUnitId'].value
    let inputEnabled = this.analogAlarmForm.controls['isInputEnabled'].value
    let outputEnabled = this.analogAlarmForm.controls['isOutputEnabled'].value
    let finalList = new Set<any>();
    this.totalResponse.forEach(tag => {
      let input = false, output = false, eng = false, type = false;
      if (tagType) {
        if (tag.tagType == tagType) {
          finalList.add(tag);
          type = true
        } else {
          type = false
        }
      } else {
        type = true
      }
      if (engUnit) {
        if (tag.engUnitId == engUnit) {
          eng = true
          finalList.add(tag);
        } else {
          eng = false
        }
      } else {
        eng = true
      }
      if (inputEnabled) {
        if (tag.isInputEnabled) {
          finalList.add(tag);
          input = true
        } else {
          input = false
        }
      } else {
        input = true
      }
      if (outputEnabled) {
        if (tag.isOutputEnabled) {
          finalList.add(tag);
          output = true
        } else {
          output = false
        }
      } else {
        output = true
      }
      if (!output || !input || !eng || !type) {
        finalList.delete(tag);
      }
    })
    let list = Array.from(finalList);
    if (list && list.length) {
      list = list.sort((a, b) => a.name.localeCompare(b.name))
      this.NoRecordsFound = false
      this.showLoaderImage = false;
      this.dataSource.data = list;
      // To get paginator events from child mat-table-paginator to access its properties
      this.myPaginator = this.myPaginatorChildComponent.getDatasource();
      this.matTablePaginator(this.myPaginator);
      this.dataSource.paginator = this.myPaginator;
      this.dataSource.sort = this.sort;
    } else {
      this.NoRecordsFound = true;
      this.showLoaderImage = false;
    }
  }


  clearFilter() {
    this.analogAlarmForm.reset();
    this.analogAlarmForm.patchValue({
      assetName: this.asset.name,
      assetId: this.asset.id
    })
    this.showLoaderImage = true;
    if (this.totalResponse && this.totalResponse.length) {
      this.NoRecordsFound = false
      this.showLoaderImage = false;
      this.dataSource.data = this.totalResponse
    } else {
      this.dataSource.data = [];
      this.NoRecordsFound = true
      this.showLoaderImage = false;
    }

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected === numRows)
      this.checkBoxToolTip = "Deselect All";
    else
      this.checkBoxToolTip = "Select All";
    if (numSelected > 0) {
      this._confirmed = true;
    }
    else {
      this._confirmed = false;
    }
    return numSelected === numRows;
  }


  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      let row = `${this.isAllSelected() ? 'select' : 'deselect'} all`;
      return row;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  // This method used to update checkbox status when it's loaded into the view
  updateCheckboxStatus(nodes) {
    let checkedNodes = nodes.filter((e) => e.isAssigned);
    this.selection = new SelectionModel(true, checkedNodes);
  }

  getAssetTags() {
    this.assetId = this.asset.id
    this.assetService.getAssetTagsByAssetId(this.assetId).subscribe(
      res => {
        let getDataSource = res;
        if (Array.isArray(res) && res.length > 0) {
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
            if (tag.tagType == 'D') {
              tag.tagTypeName = 'Discrete'
            }
            if (tag.tagType == 'A') {
              tag.tagTypeName = 'Analog'
            }
            tag.sNo = '';
          })
          getDataSource = this.formatedResponse(getDataSource);
          getDataSource = getDataSource.sort((a, b) => a.name.localeCompare(b.name));
          this.totalResponse = getDataSource
          this.NoRecordsFound = false
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
          this.NoRecordsFound = true;
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

  formatedResponse(tagList: any[]) {
    tagList.forEach(e => {
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
    tagList.forEach(e => {
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

    return tagList;
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
        this.assetSharedService.setEngUnitList(this.unitIdList);
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }

  csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true,
    showTitle: true,
    title: 'Asset Tag List',
    useBom: true,
    noDownload: false,
    headers: this.displayTableHeader
  };

  downloadFile(fileType) {
    let assetTags = []
    this.selection.selected.forEach(element => {
      let assetTag: any;
      assetTag = element;
      assetTags.push(assetTag);
    });
    if(!assetTags.length){
      this.modelNotification.alertMessage(this.globalService.messageType_Warning, 'Please select atleast one tag');
      return;
    }

    this.searchFilterObject['Asset Name'] = this.asset.name
    this.searchFilterObject['Asset Id'] = this.asset.id
    // Search filter details
    this.searchFilterKeysValues = Object.entries(this.searchFilterObject);

    this.searchFieldsContainer = {
      "searchFilterKeysValues": this.searchFilterKeysValues,
      "searchCriteriaText": this.searchCriteriaText
    }

    // Make new set of re-create object
    this.tableBodyDataList = this.globalService.reCreateNewObject(assetTags, this.downloadColumns);

    // S.No.
    this.tableBodyDataList = this.globalService.serialNumberGenerateForAssetTags(this.tableBodyDataList);

    // Make Array object into Arrays
    this.tableBodyDataList = this.tableBodyDataList.map(object => {
      return this.createArray(object);
    });

    // CSV/PDF/Excel file name
    this.fileName = this.globalService.getExportingFileName(this.asset.name+"_Tags");

    let exportFile = {
      "fileName": this.fileName,
      "excelWorkSheetName": this.exportedFileTitleName,
      "title": this.exportedFileTitleName,
      "tableHeaderNames": this.xlsxOptions.headers,
      'tableBodyData': this.tableBodyDataList
    }

    this.csvOptions.title = this.globalService.formateCSVTitle(this.searchFilterObject, "Asset Tag List");
    // Final download
    this.globalService.downloadFile(fileType, exportFile, this.searchFieldsContainer,
      this.tableBodyDataList, this.fileName, this.csvOptions);
  }

  createArray(object) {
    // Convert Obaject into Array
    let array = Object.values(object);
    // array.pop();
    return array;
  }

  refreshTableListFunction() {

  }

  /* Load table data always to the Top of the table
when change paginator page(Next, Prev, Last, First), Page size  */
  onPaginateViewScrollToTop() {
    this.directiveRef.scrollToTop();
    this.directiveRef.update();
  }

  backToAsset() {
    // this.globalService.;
    this.navigateTemplate.emit('assetViewMode');
  }
}
