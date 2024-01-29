import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { UIModalNotificationPage } from 'global';
import { Observable, of as ofObservable } from 'rxjs';
import { AccessGroup } from 'src/app/shared/model/AccessGroup';
import { AccessType } from 'src/app/shared/model/accessType';
import { Asset } from 'src/app/shared/model/asset';
import { globalSharedService } from 'src/app/shared/services/global/globalSharedService';
import { MasterService } from 'src/app/shared/services/master service/master-service.service';
import { AssetAccess, SelectedAssetAccess } from '../../../asset-template/model/assetAccess';
import { AccessGroupService } from '../../services/access group/access-group.service';
import { AssetAccessService } from '../../services/asset access/asset-access.service';


@Component({
  selector: 'app-asset-access',
  templateUrl: './asset-access.component.html',
  styleUrls: ['./asset-access.component.css']
})
export class AssetAccessComponent implements OnInit {

  assetAccessForm: FormGroup;
  accessGroups: AccessGroup[];
  @ViewChild(UIModalNotificationPage) modelNotification;
  assets: Asset[];
  orginalJson = [];
  _selectedNodes = [];
  selectedNodesData = [];
  checkedAssetIdsSaveDisabled = [];
  checkedAssetIds = new Set();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<AssetAccess, AssetAccess> = new Map<AssetAccess, AssetAccess>();

  /** Flat tree control. Able to expand/collapse a subtree recursively for flattened tree. */
  treeControl: FlatTreeControl<AssetAccess>;

  // * Tree flattener to convert a normal type of node to node with children & level information.
  treeFlattener: MatTreeFlattener<AssetAccess, AssetAccess>;

  /** The selection for checklist */
  checklistSelection

  // _selectedItems = [];

  dataSource: MatTreeFlatDataSource<AssetAccess, AssetAccess>;
  accessTypes: AccessType[];
  saveButtonDisableStatus = false;
  selectedAccessTypes: any[] = [];
  assetAccess: AssetAccess;
  assetAccessList: AssetAccess[];
  currentCheckedValue: any;
  showLoaderImage: boolean;
  isAccessTypeSelected: boolean = false;
  selectedAccessTypeIds = new Set();
  constructor(private formBuilder: FormBuilder, private assetAccessService: AssetAccessService, private masterservice: MasterService,private accessGroupService: AccessGroupService, private globalService: globalSharedService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<AssetAccess>(this.getLevel, this.isExpandable);
  }

  ngOnInit(): void {
    this.showLoaderImage = true;
    this.selectedAccessTypes = [];
    this.selectedAccessTypeIds.clear()
    this.loadAssetAccessForm();
    this.getAccessGroups();
    this.getAccessTypes();
    this.getAssetAccess("");
  }

  loadAssetAccessForm() {
    this.assetAccessForm = this.formBuilder.group({
      id: [null],
      accessGroupId: [null, Validators.required],
    })
  }

  getAccessGroups() {
    let organizationId = sessionStorage.getItem("beId");
    this.accessGroupService.getAccessGroups(Number(organizationId))
      .subscribe(
        res => {
          if (Array.isArray(res) && res.length) {
            this.accessGroups = res;
            this.accessGroups = this.accessGroups.sort((a, b) => b.id - a.id);
          }
        },
        error => {
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // Get all Acess Types
  getAccessTypes() {
    this.masterservice.getAccessTypes().subscribe(
      res => {
        this.accessTypes = res;
      },
      error => {
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }
  onChangeAccessGroup(event) {
    this.saveButtonDisableStatus = false;
    this._selectedNodes = [];
    this.selectedAccessTypes = [];
    this.selectedAccessTypeIds.clear()
    let accessGroupId;
    if (event.target.options.selectedIndex === 0) {
      accessGroupId = "";
    }
    else {
      accessGroupId = event.target.value;
    }
    this.getAssetAccess(accessGroupId);

  }

  //To get all Assets
  getAssetAccess(accessGroupId) {
    this.checkedAssetIdsSaveDisabled = []
    this.selectedNodesData = [];
    this.checkedAssetIds.clear();
    this.nestedNodeMap.clear();
    let organizationId = Number(sessionStorage.getItem("beId"));
    this.assetAccessService.getAssetAccessList(organizationId, accessGroupId).subscribe(
      res => {
        this.showLoaderImage = false;
        //  this.showLoaderImage = false;
        if (Array.isArray(res) && res.length) {
          this.orginalJson = res;
          this.getSelectedAssetAccess();
          this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
          this.dataSource.data = res.sort((a, b) => a.id - b.id);
          /** The selection for checklist */
          this.checklistSelection = new SelectionModel<AssetAccess>(true /* multiple */);
          this.updateTreeCheckbox(this.treeControl.dataNodes);
        }
      },
      error => {
        this.showLoaderImage = false;
        this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
      });
  }


  getLevel = (node: AssetAccess) => { return node.level; };

  isExpandable = (node: AssetAccess) => { return node.expandable; };

  getChildren = (node: AssetAccess): Observable<AssetAccess[]> => {
    return ofObservable(node.childAssets);
  }

  hasChild = (_: number, _nodeData: AssetAccess) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: AssetAccess) => { return _nodeData.assetName === ''; };

  /**
  * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
  */
  transformer = (node: AssetAccess, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.assetName === node.assetName ? this.nestedNodeMap.get(node)! : new AssetAccess();
    flatNode.assetName = node.assetName;
    flatNode.level = level;
    flatNode.assetId = node.assetId;
    flatNode.parentAssetId = node.parentAssetId;
    // flatNode.accessTypeId = node.accessTypeId
    flatNode.expandable = (node.childAssets.length > 0) ? true : false;
    flatNode.isSelected = (node.isSelected) ? true : false;
    flatNode['visible'] = true;
    if (node.id != undefined) {
      flatNode.id = node.id;
    } else {
      node.id = null;
    }
    if (node.accessTypeId != undefined) {
      for (let i = 0; i < this.accessTypes.length; i++) {
        if (node.accessTypeId == this.accessTypes[i].id) {
          node.isEditable = false;
          flatNode.accessTypeId = node.accessTypeId;
          this.patchAccessType(node)
          break;
        }
      }
    } else {
      flatNode.accessTypeId = null;
      node.accessTypeId = null;
      node.isEditable = true;
    }
    //this.flatNodeMap.set(flatNode, node);
    if (node.isSelected) {
      this.checkValidation(node.isSelected, node);
    }
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: AssetAccess): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: AssetAccess): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child =>
      this.checklistSelection.isSelected(child)
    );
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: AssetAccess, status): void {
    if (status == false)
      this.removeUnselectedAccessTypes(status, node);
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.setIsselectedValue(descendants, node, status);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node, status);
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
    this._selectedNodes = this.checklistSelection.selected;
    // this.saveButtonDisableStatus = true;
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    //
  }

  //Save Button Disable Status Update
  saveButtonDisableStatusUpdate(nodeLength) {
    if (nodeLength.length === this.selectedAccessTypeIds.size) {
      this.saveButtonDisableStatus = true;
    }
    else {
      this.saveButtonDisableStatus = false;
    }

  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: AssetAccess, status): void {
    node.isSelected = status
    if (status == false)
      this.removeUnselectedAccessTypes(status, node);
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node, status);
    this._selectedNodes = this.checklistSelection.selected;
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
    // this.saveButtonDisableStatus = true;
    this.markSelectedNode(node, this.checklistSelection.isSelected(node));
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: AssetAccess, status): void {
    let parent: AssetAccess | null = this.getParentNode(node, status);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent, status);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: AssetAccess): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {  //Deselect the children so parent make interminate state (-)
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      // If all the children selected then parent also selecting
      this.checklistSelection.select(node);
    }
    else if (!nodeSelected && !descAllSelected) {
      node.isSelected = false;
      this.checkValidation(false, node);
      //this.removeUnselectedAccessTypes(false, node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: AssetAccess, status): AssetAccess | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        if (status != null) {
          currentNode.isSelected = status;
          this.checkValidation(status, currentNode);
          if (status == false)
            this.removeUnselectedAccessTypes(status, currentNode);
        }
        return currentNode;
      }
    }
    return null;
  }


  /* Set isSelected value to all childrens of passed tree */
  traverseDown(o, s) {
    try {
      for (let i in o) {
        o[i]["isSelected"] = s;
        this.checkValidation(s, o[i]);
        if (s == false)
          this.removeUnselectedAccessTypes(s, o[i]);
        if (o[i]["childAssets"].length > 0) {
          this.traverseDown(o[i]["childAssets"], s);
        }
      }
    } catch (err) {
      //TODO: Handle exception
    }
  }

  /* Set isSelected value to all parents of passed tree */
  traverseUp(o, n, s) {
    let pn = this.getParentNode(n, null); // Build function to get parent node
    if (pn) {
      let tempNode = this.findNode(o, pn.assetId);
      if (!s && tempNode.childAssets.length > 0 && tempNode.childAssets.filter(e => e.isSelected).length > 0) {
        return;
      }
      //tempNode["isSelected"] = s;
      // this.checkValidation(s, pn);
      this.traverseUp(o, pn, s);
    }
  }

  /* Returns node by id */
  findNode(o, id) {
    for (let i in o) {
      if (o[i]["assetId"] === id) return o[i];
      if (o[i]["childAssets"].length > 0) {
        let tempNode = this.findNode(o[i]["childAssets"], id);
        if (tempNode) return tempNode;
      }
    }
  }

  // Removes unselected nodes from tree
  stripUnselectedNodes(o) {
    for (let i = 0; i < o.length; i++) {
      if (typeof o[i]["isSelected"] === 'undefined' || !o[i]["isSelected"]) {
        o.splice(i, 1);
        --i;
      } else {
        // delete o[i]["isSelected"]; // Uncomment if you don't want to pass isSelecetd
        if (o[i].childAssets.length > 0) this.stripUnselectedNodes(o[i].childAssets);
      }
    }
  }

  /* Set isSelected value when user toggle checkbox selection  */
  markSelectedNode(node, status) {
    try {
      let selectedNode = this.findNode(this.orginalJson, node.assetId);
      if (selectedNode) {
        //selectedNode["isLandingMenu"] = status;
        // selectedNode["isSelected"] = status; // Updating root isSelected value
        this.checkValidation(status, node);
        if (status == false)
          this.removeUnselectedAccessTypes(status, node);
        this.traverseUp(this.orginalJson, node, status);
        if (selectedNode.childAssets.length > 0) this.traverseDown(selectedNode.childAssets, status); // Update descendants isSelected value when this node has menus which is not empty
      }
    } catch (err) {
      console.error("Unable to set status -- " + err);
    }
  }


  // This method used to update checkbox status when it's loaded into the view
  updateTreeCheckbox(nodes) {
    let checkedNodes = nodes.filter((e) => e.isSelected);
    for (let node in checkedNodes) this.todoItemSelectionToggle(checkedNodes[node], true);
  }

  // islanding true making
  onChangeAccessType(event, node) {
    if (event.target.selectedIndex === 0) {
      if (!this.checkedAssetIds.has(node.assetId)) {
        this.checkedAssetIds.add(node.assetId);
        this.checkedAssetIdsSaveDisabled.push(node.assetId)
      }
      if (this.selectedAccessTypeIds.has(node.assetId)) {
        this.selectedAccessTypeIds.delete(node.assetId);
      }
    }
    else {
      if (this.checkedAssetIds.has(node.assetId)) {
        this.checkedAssetIds.delete(node.assetId);
      }
      let obj = {
        "accessTypeId": event.target.value,
        "assetId": node.assetId
      }
      this.selectedAccessTypes.push(obj);
      this.selectedAccessTypeIds.add(node.assetId);
    }
    this.saveButtonDisableStatusUpdate(this._selectedNodes);
  }

  patchAccessType(node) {
    let obj = {
      "accessTypeId": node.accessTypeId,
      "assetId": node.assetId
    }
    this.selectedAccessTypes.push(obj);
    this.selectedAccessTypeIds.add(node.assetId)
  }

  resetassetAccessForm() {
    this.assetAccessForm.reset();
    this.getAssetAccess("");
  }


  redirectTo() {

  }
  saveAssetAccess() {
    this.showLoaderImage = true;
    let assetAccessList = [];
    let selectedAssetAccess = new SelectedAssetAccess();
    this.assetAccess = this.assetAccessForm.value;
    this._selectedNodes.forEach(element => {
      let assetAccessobj: AssetAccess = new AssetAccess();
      if (element.id == undefined) {
        assetAccessobj.id = null;
      }
      assetAccessobj.accessGroupId = this.assetAccess.accessGroupId;
      assetAccessobj.createdBy = Number(sessionStorage.getItem("userId"));
      assetAccessobj.updatedBy = assetAccessobj.createdBy;
      if (element.id == undefined) {
        assetAccessobj.id = null;
      }
      else {
        assetAccessobj.id = element.id;
      }
      assetAccessobj.assetId = element.assetId;
      for (let i = 0; i < this.selectedAccessTypes.length; i++) {
        if (element.assetId == Number(this.selectedAccessTypes[i].assetId)) {
          assetAccessobj.accessTypeId = this.selectedAccessTypes[i].accessTypeId;
          break;
        }
      }
      assetAccessobj.status = "Active";
      assetAccessList.push(assetAccessobj);
    })
    selectedAssetAccess.assetAccessList = assetAccessList;
    selectedAssetAccess.selectedNodesData = this.selectedNodesData;
    this.assetAccessService.saveAssetAccess(selectedAssetAccess)
      .subscribe(
        res => {
          this.showLoaderImage = false;
          // Success response
          this.modelNotification.alertMessage(res['messageType'], res['message']);
        }, (error) => {
          this.showLoaderImage = false;
          this.modelNotification.alertMessage(this.globalService.messageType_Fail, error);
        });
  }

  // Removes unselected nodes from tree
  stripUnselectedObjectes(o) {
    for (let i = 0; i < o.length; i++) {
      if (typeof o[i]["accessTypeId"] === 'undefined' || !o[i]["accessTypeId"] == null) {
        o.splice(i, 1);
        --i;
      }
    }
  }

  parseInt(id) {
    if (isNaN(id)) {
      return id;
    }
    return parseInt(id);
  }
  removeDuplicates(arr) {
    var o = {}
    arr.forEach(function (e) {
      o[e] = true
    })
    return Object.keys(o)
  }
  getSelectedAssetAccess() {

    this.recursiveIteration(this.orginalJson)
  }
  recursiveIteration(assetAccessList) {
    assetAccessList.forEach(e => {
      if (e.isSelected == true && e.accessTypeId != null) {
        this.selectedNodesData.push(e);
      }
      else if (e.isSelected === false && e.accessTypeId != null) {
        this.selectedNodesData.push(e);
      }
      if (e.childAssets.length != 0 && e.childAssets != undefined) {
        this.recursiveIteration(e.childAssets);
      }
    })
  }
  checkValidation(status, node) {
    if (status == true) {
      if (!this.checkedAssetIds.has(node.assetId)) {
        this.checkedAssetIds.add(node.assetId);
        this.checkedAssetIdsSaveDisabled.push(node.assetId)
      }
      if (node.accessTypeId != undefined && node.accessTypeId != null) {
        if (this.checkedAssetIds.has(node.assetId)) {
          this.checkedAssetIds.delete(node.assetId);
        }
      }
    }
    else {
      if (this.checkedAssetIds.has(node.assetId)) {
        this.checkedAssetIds.delete(node.assetId);
      }
      if (node.accessTypeId == undefined && node.accessTypeId == null) {
        if (this.checkedAssetIds.has(node.assetId)) {
          this.checkedAssetIds.delete(node.assetId);
        }
      }
    }
  }

  setIsselectedValue(descendants, node, status) {
    this.updateNodeStatus(node, status)
    if (descendants != undefined && descendants != null) {
      for (let node of descendants) {
        this.updateNodeStatus(node, status)
      }
    }

  }
  updateNodeStatus(node, status) {
    if (status == true)
      node.isSelected = status
    else {
      node.isSelected = status
      /* if (this.checkedAssetIds.has(node.assetId)) {
        this.checkedAssetIds.delete(node.assetId);
      } */
    }
  }
  removeUnselectedAccessTypes(status, node) {
    if (status == false) {
      if (this.selectedAccessTypeIds.has(node.assetId)) {
        this.selectedAccessTypeIds.delete(node.assetId);
      }
      if (node.accessTypeId == undefined && node.accessTypeId == null) {
        if (this.selectedAccessTypeIds.has(node.assetId)) {
          this.selectedAccessTypeIds.delete(node.assetId);
        }
      }
    }
  }
}
