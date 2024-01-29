import { Injectable } from "@angular/core";
import { TimeZone } from "global/lib/model/timeZone";

@Injectable()
export class globalShareServices {
  
    // Getting ID value 
    public assignId = null;
    public listOfRow = [];
    assignUser: string;
    name: any;
    parenetName:any;
    commStandards: any[];
    noofpins: number;
    details: any;
    pindetails: any;
    gatewayModelPorts: any[];
    isRequestFromPreviewBack: boolean;
    pinsLists: any[];
    previouseAssignPins: any[];
    source: any[];
    assignedPinPort: any[];
    prevAssignedCommStandard: Array<number> = [];
    globalObject: any;
    assigngatewayTemplateIdId: number;
    timeZoneList: TimeZone[];
    dataTypes: any[];
    standardIOTags: any[];
    tagTypes: any[];
    engUnits: any[];
    tagIOModes: any[];
    channelDisplayOrderData = new Set();
    nodeComponentDisplayOrderdata = new Set();
    nodeDataHandlerDisplayOrderdata = new Set();
    protocolParamDisplayOrderData = new Set();
    isDefaultValue: boolean = false;
    protocolCodeData = new Set();
    public isTemplate:boolean;
    protocolNames = new Set();
    channelParamGroupNames = new Set();
    nodeComponentParamGroupNames = new Set();
    dataHandlerParamGroupNames = new Set();
    protocolParamNames=new Set();
    protocolParamValues=new Set();
    availableStandardDataList: any[];
    nodeIdentifier: string;
    // When click on update, ID will pass to respective updata view
    GettingId(id) {
        this.assignId = id;
        setTimeout(() => {
            this.assignId = null;
        }, 2000)
    }

    GettingString(name) {
        this.name = name;
        setTimeout(() => {
            this.name = null;
        }, 2000)
    }
    gettingName(parentName){
        this.parenetName=parentName;
    }
   gettingTemplate(template){
       this.isTemplate=template
   }
    setGlobalId(id) {
        this.assignId = id;
    }

    setGlobalName(setName) {
        this.name = setName;
    }



    GettingIdgateway(gatewayTemplateId: number) {
        this.assigngatewayTemplateIdId = gatewayTemplateId;
        setTimeout(() => {
            this.assigngatewayTemplateIdId = null;
        }, 2000)
    }

    // Store json valu to global level for show click to edit view
    listOfRowDetail(listOfRowDetail, user) {
        this.listOfRow = [];
        this.assignUser = user;
        this.listOfRow = listOfRowDetail;
    }
    setCommStandards(confirmed: any[]) {
        this.commStandards = confirmed;
        setTimeout(() => {
            this.commStandards = null;
        }, 2000)
    }
    setGatewayModelPort(confirmed: any[]) {
        this.gatewayModelPorts = confirmed;
        setTimeout(() => {
            this.gatewayModelPorts = null;
        }, 2000)
    }
    SetPins(numberOfPins: number) {
        this.noofpins = numberOfPins;
        setTimeout(() => {
            this.noofpins = null;
        }, 2000)
    }


    SetPinDetails(pinsDetails: any, pinsDetail: any) {
        this.details = pinsDetails;
        this.pindetails = pinsDetail;
        setTimeout(() => {
            this.details = null;
        }, 2000)
    }

    SetRequestFromPreviewBack(requestFlag: boolean) {
        this.isRequestFromPreviewBack = requestFlag;
        setTimeout(() => {
            this.isRequestFromPreviewBack = null;
        }, 2000)
    }

    setPinsList(pinsList: any[]) {
        this.pinsLists = pinsList;
    }
    setPreviousePinsList(assignedPinsList: any[]) {
        this.previouseAssignPins = assignedPinsList;
        setTimeout(() => {
            this.previouseAssignPins = null;
        }, 2000)
    }
    setSource(source: any[]) {
        this.source = source;
        setTimeout(() => {
            this.source = null;
        }, 2000)
    }
    setPrevAssignedPinPort(allCommStandardDataList: any[]) {
        this.assignedPinPort = allCommStandardDataList;
        setTimeout(() => {
            this.assignedPinPort = null;
        }, 2000)
    }

    setPreviouseCommStandard(prevAssignedMappedData: number[]) {
        this.prevAssignedCommStandard = prevAssignedMappedData;
        setTimeout(() => {
            this.prevAssignedCommStandard = null;
        }, 2000)
    }

    setGlobalObject(object: any) {
        this.globalObject = object;
    }
    setTimezone(timeZoneList: TimeZone[]) {
        this.timeZoneList = timeZoneList;
    }
    setDataTypes(dataTypes) {
        this.dataTypes = dataTypes;
    }
    setTagTypes(tagTypes) {
        this.tagTypes = tagTypes;
    }
    setEngUnits(engUnits) {
        this.engUnits = engUnits;
    }
    setStandardIOTags(standardIOTags) {
        this.standardIOTags = standardIOTags;
    }
    setTagIOModes(tagIOModes) {
        this.tagIOModes = tagIOModes;
    }

    channelDisplayOrder(displayOrder) {
        this.channelDisplayOrderData.add(displayOrder);
    }
    nodeComponentDisplayOrder(displayOrder) {
        this.nodeComponentDisplayOrderdata.add(displayOrder);
    }
    nodeDataHandlerDisplayOrder(displayOrder) {
        this.nodeDataHandlerDisplayOrderdata.add(displayOrder);
    }

    protocolParamDisplayOrder(displayOrder) {
        this.protocolParamDisplayOrderData.add(displayOrder);
    }

    checkDisplayOrder(object, displayOrder) {
        if (object.has(displayOrder)) {
            return true;
        }
        else {
            return false
        }
    }
    setIsDefaultProtocolParamValueData(isDefaultValue: boolean) {
        this.isDefaultValue = isDefaultValue;
    }

    setProtocolCode(code: string) {
        this.protocolCodeData.add(code);
    }

    setProtocolName(protocolName: string) {
        this.protocolNames.add(protocolName);
    }
    setChannelParamName(protocolParmGroupName: string) {
        this.channelParamGroupNames.add(protocolParmGroupName);
    }

    setNodeComponentParamName(protocolParmGroupName: string) {
        this.nodeComponentParamGroupNames.add(protocolParmGroupName);
    }

    setDataHandlerParamName(protocolParmGroupName: string) {
        this.dataHandlerParamGroupNames.add(protocolParmGroupName);
    }


    checkDuplcateName(object, name) {
        if (object.has(name)) {
            return true;
        }
        else {
            return false
        }
    }

    setProtocolParamName(protocolParamName: string) {
        this.protocolParamNames.add(protocolParamName);
    }

    setProtocolParamValue(protocolParamValue: String) {
        this.protocolParamValues.add(protocolParamValue);
    }

    setAllCommunicationStandards(availableStandardDataList: any[]) {
		this.availableStandardDataList=availableStandardDataList;
    }
    
    setPreviousNodeIdentifier(nodeIdentifier: string) {
        this.nodeIdentifier=nodeIdentifier;
      }
}