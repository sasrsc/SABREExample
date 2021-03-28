import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";
import { getService } from "../Context";
import { ICommandMessageService } from "sabre-ngv-commsg/services/ICommandMessageService";
import {
  CommandMessageBasicRs,
  CommandMessageRq,
} from "sabre-ngv-pos-cdm/commsg";

import { ISoapApiService } from "sabre-ngv-communication/interfaces/ISoapApiService";
import { SoapRs } from "sabre-ngv-communication/interfaces/SoapRs";
import { SoapRq } from "sabre-ngv-communication/interfaces/SoapRq";

import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import { RestApiService } from "sabre-ngv-communication/services/RestApiService";
import { RestResponse } from "sabre-ngv-communication/interfaces/RestResponse";
import { RestRq } from "sabre-ngv-communication/interfaces/RestRq";

import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { CommandMessageReservationRs } from "sabre-ngv-pos-cdm/reservation";

import { PnrPublicService } from "sabre-ngv-app/app/services/impl/PnrPublicService";

import { AgentProfileService } from "sabre-ngv-app/app/services/impl/AgentProfileService";
import { Variables } from "../services/Variables";
import { string } from "underscore";
/*
 * class CommFoundHelper, utiility methods to consume main Communication Foundation APIs
 *
 */

export class CommFoundHelper extends AbstractService {
  static SERVICE_NAME =
    "com-sabre-redapp-showcase-web-module-service-commfound";

  public xmlPayloads = {
    ElementName: "{XmlContent}",

    PersonName:
      "<PersonName>" +
      "<GivenName>{GivenName}</GivenName>" +
      "<Surname>{Surname}</Surname>" +
      "</PersonName>",

    PersonNameSas:
      '<PersonName NameReference="{FOP}-{Emp}-{CC}{VIP}{GRP}">' +
      "<GivenName>{GivenName}</GivenName>" +
      "<Surname>{Surname}</Surname>" +
      "</PersonName>",

    StmtInfo:
      '<PersonName NameReference="{FOP}-{Emp}-{CC}{VIP}{GRP}">' +
      "</PersonName>",

    ContactNumber:
      '<ContactNumber LocationCode="FSG" NameNumber="1.1" Phone="817-555-1212" PhoneUseType="H"/>',

    ContactNumbers:
      "<ContactNumbers>" + "{ContactNumber}" + "</ContactNumbers>",

    CustomerIdentifier:
      "<CustomerIdentifier>{CustomerIdentifier}</CustomerIdentifier>",

    CustomerInfo:
      "<CustomerInfo>" +
      "{ContactNumbers}" +
      "{CustomerIdentifier}" +
      "{Email}" +
      "{PersonName}" +
      "</CustomerInfo>",

    Email:
      '<Email Address="WEBSERVICES.SUPPORT@SABRE.COM" LanguageOverride="O" NameNumber="1.1" ShortText="ABC123" Type="CC"/>',

    Address:
      "<Address>" +
      "<AddressLine>{AddressLine}</AddressLine>" +
      "<CityName>{CityName}</CityName>" +
      "<CountryCode>{CountryCode}</CountryCode>" +
      "<PostalCode>{PostalCode}</PostalCode>" +
      '<StateCountyProv StateCode="{StateCode}"/>' +
      "<StreetNmbr>{StreetNmbr}</StreetNmbr>" +
      "</Address>",

    AddressSabre:
      "        <Address>" +
      "            <AddressLine>SABRE TRAVEL</AddressLine>" +
      "            <CityName>SOUTHLAKE</CityName>" +
      "            <CountryCode>US</CountryCode>" +
      "            <PostalCode>76092</PostalCode>" +
      '            <StateCountyProv StateCode="TX"/>' +
      "            <StreetNmbr>3150 SABRE DRIVE</StreetNmbr>" +
      "        </Address>",

    AgencyInfo: "<AgencyInfo>" + "{Address}" + "</AgencyInfo>",

    TravelItineraryAddInfoRQ:
      "<TravelItineraryAddInfoRQ>" +
      "{AgencyInfo}" +
      "{CustomerInfo}" +
      "</TravelItineraryAddInfoRQ>",

    AddRemarkRQ:
      "<AddRemarkRQ>" +
      "<RemarkInfo>{Remark}" +
      "</RemarkInfo>" +
      "</AddRemarkRQ>",

    AddRemarkLLSRQ:
      '<AddRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ReturnHostCommand="false" TimeStamp="2012-11-15T14:15:00-06:00" Version="2.1.0">' +
      "<RemarkInfo>{Remark}" +
      "</RemarkInfo>" +
      "</AddRemarkRQ>",

    Remark:
      '<Remark Type="General">' + "<Text>" + "{Text}" + "</Text>" + "</Remark>",

    RemarkAlpha:
      '<Remark Code="{Code}" Type="Alpha-Coded">' +
      "<Text>" +
      "{Text}" +
      "</Text>" +
      "</Remark>",

    RemarkInvoice:
      '<Remark Type="Invoice">' + "<Text>" + "{Text}" + "</Text>" + "</Remark>",

    ModifyRemarkLLSRQ:
      '<ModifyRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.1.2">' +
      "<RemarkInfo>{Remark}" +
      "</RemarkInfo>" +
      "</ModifyRemarkRQ>",

    RemarkModify:
      '<Remark Code="{Code}" Number={LineNumber} Type="Alpha-Coded">' +
      "<Text>" +
      "{Text}" +
      "</Text>" +
      "</Remark>",

    RemarkModifyInvoice:
      '<Remark Number={LineNumber} Type="Invoice">' +
      "<Text>" +
      "{Text}" +
      "</Text>" +
      "</Remark>",
    DeleteRemark:
      '<ModifyRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.1.2">' +
      "<RemarkInfo><Remark Number={LineNumber} />" +
      "</RemarkInfo>" +
      "</ModifyRemarkRQ>",

    RemarkDelete: '<Remark Number="{LineNumber}" />',

    SpecialReqDetails:
      "<SpecialReqDetails>" + "{AddRemarkRQ}" + "</SpecialReqDetails>",

    PassengerDetailsRQ:
      '<PassengerDetailsRQ xmlns="http://services.sabre.com/sp/pd/v3_4" version="3.4.0" ignoreOnError="true" haltOnError="true">' +
      "{MiscSegmentSellRQ}" +
      "{SpecialReqDetails}" +
      "{TravelItineraryAddInfoRQ}" +
      "</PassengerDetailsRQ>",

    MiscSegmentSellRQ:
      "<MiscSegmentSellRQ>" +
      '<MiscSegment DepartureDateTime="12-21" InsertAfter="0" NumberInParty="1" Status="GK" Type="OTH">' +
      '<OriginLocation LocationCode="FSG"/>' +
      "<Text>TEST</Text>" +
      "<VendorPrefs>" +
      '<Airline Code="XX"/>' +
      "</VendorPrefs>" +
      "</MiscSegment>" +
      "</MiscSegmentSellRQ>",

    FOP_Remark:
      "<FOP_Remark>" +
      '<CC_Info Suppress="false">' +
      '<PaymentCard Code="VI" ExpireDate="2021-12" Number="4444333322221111" />' +
      "</CC_Info>" +
      "</FOP_Remark>",

    SabreCommandLLSRQ:
      '<SabreCommandLLSRQ xmlns="http://webservices.sabre.com/sabreXML/2003/07" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" TimeStamp="2014-03-04T14:00:00" Version="1.8.1">' +
      '<Request Output="SCREEN" CDATA="true">' +
      "<HostCommand>{HostCommand}</HostCommand>" +
      "</Request>" +
      "</SabreCommandLLSRQ>",

    GetProfile:
      '<Sabre_OTA_ProfileToPNRRQ Target="Production" TimeStamp="2013-04-30T08:24:42.967Z" Version="6.55" xsi:schemaLocation="http://www.sabre.com/eps/schemas schemasSabre_OTA_ProfileCreateRQ.xsd" xmlns="http://www.sabre.com/eps/schemas" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
      "<FilterPath>" +
      '<Profile ClientCode="TN" ClientContextCode="TMP" ProfileName="{Profile}" UniqueID="*" PNRMoveOrderSeqNo="1" DomainID="29JB" ProfileTypeCode="{Type}" BlindMoveByProfName="Y">' +
      "</Profile>" +
      "</FilterPath>" +
      "</Sabre_OTA_ProfileToPNRRQ>",

    PassportVisaEntry:
      //3.P¥CA/NA-US/P-YES/V-NO/PS-YES/VS-NO/PD-YES/EXP-NO/D-P
      '<Remark Code="{Code}" Type="Alpha-Coded">' +
      "<Text>" +
      "{Destination}¥/NA-{Nationality}/P-{PassportRequired}/V-{VisaRequired}/PS-{PassportStatus}/VS-{VisaStatus}/PD-{PrimaryDocument}/EXP-{ExpiresSoon}/D-{DocumentType}" +
      "</Text>" +
      "</Remark>",

    GetReservationRQ:
      '<GetReservationRQ xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" Version="1.19.0" EchoToken="">' +
      "<RequestType>Stateful</RequestType>" +
      "</GetReservationRQ>",

    // http://files.developer.sabre.com/drc/servicedoc/AddAccountingLineLLSRQ_v2.0.0_Sample_Payloads.xml
    // <!-- Add an air accounting line for non interactive electronic ticket with the vendor/product included. -->
    // <!-- Equivalent Sabre host command: AC/BA/28282828280/0.00/100.00/8.00/ONE/CK 1.1D JOHN/2/D/E-V-ABC123/P-DEF456 -->
    AddAccountingLineRQ:
      '<AddAccountingLineRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" TimeStamp="2015-04-09T14:30:00-06:00" Version="2.0.0">' +
      "<AirAccountingLines>" +
      "{AccountingLine}" +
      "</AirAccountingLines>" +
      "</AddAccountingLineRQ",

    GetAccountingLinesRQ:
      '<GetReservationRQ xmlns="http://webservices.sabre.com/pnrbuilder/v1_19" Version="1.19.0" EchoToken="">' +
      "<RequestType>Stateful</RequestType>" +
      '<ReturnOptions UnmaskCreditCard="false" ShowTicketStatus="false" Language="EN" PriceQuoteServiceVersion="3.0.0" IncludePaymentCardToken="false">' +
      "<SubjectAreas>" +
      "<SubjectArea>ACCOUNTING_LINE</SubjectArea>" +
      "</SubjectAreas>" +
      "</ReturnOptions>" +
      "</GetReservationRQ>",
  };

  getXmlPayload(name: string, values: any): string {
    let retVal = null;
    if (this.xmlPayloads[name]) {
      let tmpVar = this.xmlPayloads[name];
      tmpVar = tmpVar.replace(
        /(([\{])(.+?)(\}))/g,
        (strFound, p1, p2, p3, p4, offset, astring) => {
          //p3 return the variable name between {varName}
          //   console.log(
          //     "found variable token",
          //     strFound,
          //     values[p3],
          //     typeof values[p3],
          //     p1,
          //     p2,
          //     p3,
          //     p4,
          //     offset,
          //     astring
          //   );
          if (_.isNull(values)) return "";
          if (values[p3] && typeof values[p3] == "string") {
            return values[p3];
          } else if (typeof values[p3] == "function") {
            return values[p3]();
          } else {
            return "";
          }
        }
      );
      retVal = tmpVar;
    }
    return retVal;
  }
  /*
   * Helper method to consume ICommandMessageService
   * ICommandMessageService, allows to send requests on the CommandFlow supports different Classes of payloads, from simple CommandMessageRQ, which is equivalent of Sabre GDS Format typed when under Manual Command flow, up to specialized dat
   * buildDependencies :
   * { "sabre-ngv-pos-cdm" : "*", "sabre-ngv-commsg": "*" }
   * main method :
   */
  sendCommandMessage(
    payload: string,
    showRq: boolean,
    showRs: boolean
  ): Promise<CommandMessageBasicRs> {
    //get reference to the service
    const iCmdMsgService = getService(ICommandMessageService);
    //call send method with payload
    return iCmdMsgService.send({
      rq: payload,
      showRq: showRq,
      showRs: showRs,
    });
  }

  /*
   * Helper method to consume XML/SOAP Sabre APIs
   * Allow easy acess to Sabre GDS Platform, the APIs
   * buildDependencies :
   * { "sabre-ngv-pos-cdm" : "*", "sabre-ngv-commsg": "*" }
   * main method :
   */
  sendSWSRequest(request: SoapRq): Promise<SoapRs> {
    //get reference to the service
    const iSWSService = getService(ISoapApiService);
    //call send method with payload
    return iSWSService.callSws(request);
  }

  sendAndHandleSWSRequest(
    //request: SoapRq,
    //request: SoapRq,
    action: string,
    payload: string,
    bannerText: string,
    refreshTrip: boolean,
    displayGraphicalPnr: boolean,
    closePopover: boolean
  ): void {
    // copy of alex's original SWSRequest
    getService(CommFoundHelper)
      .sendSWSRequest({
        action: action,
        payload: payload,
        authTokenType: "SESSION",
      })
      .then((res) => {
        console.log(res);

        if (res.errorCode !== undefined && res.errorCode !== null) {
          getService(IAreaService).showBanner(
            "Error",
            "Failed: ".concat(res.errorCode),
            bannerText
          );
        } else {
          getService(IAreaService).showBanner(
            "Success",
            `Request Processed`,
            bannerText
          );
        }

        if (refreshTrip === true) {
          getService(CommFoundHelper).refreshTripSummary;
        }
        if (displayGraphicalPnr === true) {
          getService(CommFoundHelper).displayGraphicalPnr;
        }
        // if (closePopover === true) {
        //   this.props.handleClose();
        // }
      });
  }

  /*
   * Helper method to consume RestApiService
   * Helper method to consume REST/JSON Sabre APIs
   * Allow easy acess to Sabre GDS Platform, the APIs
   * buildDependencies :
   * { "sabre-ngv-communication": "*" }
   * main method :
   */
  sendRestRequest(request: RestRq): Promise<RestResponse> {
    //get reference to the service
    const iRestService = getService(RestApiService);
    //call send method with payload
    return iRestService.send(request);
  }

  /*
   * Helper method to consume HttpWebRequest
   *
   * buildDependencies :
   * { "sabre-ngv-communication": "*" }
   */

  sendExternalHttpRequest(
    request: RestRq,
    options?,
    contentType?
  ): Promise<RestResponse> {
    //get reference to the service
    const iRestService = getService(RestApiService);
    //call send method with payload
    return iRestService.sendExternal(request, options, contentType);
  }

  getReservation(): Promise<CommandMessageReservationRs> {
    return getService(IReservationService).getReservation();
  }

  refreshTripSummary(): void {
    getService(PnrPublicService).refreshData();
  }

  displayGraphicalPnr(): void {
    getService(PnrPublicService).displayGraphicalPnr();
  }

  getAgentProfileService(): AgentProfileService {
    return getService(AgentProfileService);
  }

  parseStatementInfo(stmtInfo: string) {
    let parsedObject: any = {};
    parsedObject.success = false;
    parsedObject.text = stmtInfo;
    parsedObject.group = "";
    parsedObject.vip = "";
    parsedObject.empno = "";
    parsedObject.fop = "";
    parsedObject.costcent = "";

    if (stmtInfo !== undefined && stmtInfo !== "") {
      let re = /^([a-zA-Z]{3})-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)-?(VIP)?-?(GRP)?/;

      let match = re.exec(stmtInfo);

      // SAS-6785-7206 or SAS-6785-7206-VIP or SAS-6785-7206-GRP or SAS-6785-7206-GRPVIP

      if (match) {
        parsedObject.success = true;
        match[1] !== undefined ? (parsedObject.fop = match[1]) : "";
        match[2] !== undefined ? (parsedObject.empno = match[2]) : "";
        match[3] !== undefined ? (parsedObject.costcent = match[3]) : "";
        match[4] !== undefined ? (parsedObject.vip = match[4]) : "";
        match[5] !== undefined ? (parsedObject.group = match[5]) : "";

        // parsedObject.fop = match[1];
        // parsedObject.empNo = match[2];
        // parsedObject.costcent = match[3];
        // if (match[4] !== undefined) {
        //   parsedObject.vip = true;
        // }
        // if (match[5] !== undefined) {
        //   parsedObject.group = true;
        // }
      }
    }
    console.log(parsedObject);

    return parsedObject;
  }

  getXmlTagValue(node, targetElem): any {
    let retValue: string = "";

    if (node.getElementsByTagName(targetElem).length == 0) {
      // return the empty string
    } else {
      retValue = node.getElementsByTagName(targetElem)[0].childNodes[0]
        .nodeValue;
    }
    return retValue;
  }

  getXmlAttributeValue(node, attributeTarget: string): any {
    console.log(`searching for ${attributeTarget}`);
    let retValue = "";

    if (node.getAttribute(attributeTarget) === null) {
      // return the empty string
      retValue = "";
      console.log(`can't find the targetElem ${retValue}`);
    } else {
      retValue = node.getAttribute(attributeTarget);
      console.log(retValue);
    }
    return retValue;
  }

  getSASToken = async (): Promise<string> => {
    //e.preventDefault();
    console.log(`Getting SAS Token`);
    let token = getService(Variables).getGlobal("SASToken");
    let getNewToken = true;
    if (Object.keys(token).length > 0) {
      if (Date.now() < token.token_end) {
        console.log(`Existing token is still good`);
        getNewToken = false;
        // return existing token
        return token.access_token;
      }
    }
    if (getNewToken === true) {
      const url: string = "https://itviya.sas.com/SASLogon/oauth/token";
      let username: string = await getService(Variables).getGlobal("username");
      console.log(`username from await call ${username}`);

      let password: string = await getService(Variables).getGlobal("password");
      let returnObj: any = {};
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa("sas.ec:"),
        },
        body:
          //          "grant_type=password&response_type=bearer&username=xxxxxx&password=xxxxxxx",
          "grant_type=password&response_type=bearer&username=" +
          username +
          "&password=" +
          password,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          returnObj = responseJson;
          returnObj["token_start"] = new Date();
          returnObj["token_end"] = new Date(Date.now() + returnObj.expires_in);
          console.log(returnObj);
          //return returnObj;
          console.log(`Returning SAS Token`);
          getService(Variables).setGlobal("SASToken", returnObj);
          return returnObj.access_token;
          //return returnObj;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  getSASToken2 = async (): Promise<string> => {
    //e.preventDefault();
    console.log(`Getting SAS Token using sabreclient id & token`);
    let token = getService(Variables).getGlobal("SASToken2");
    let getNewToken = true;
    if (Object.keys(token).length > 0) {
      if (Date.now() < token.token_end) {
        console.log(`Existing token is still good`);
        getNewToken = false;
        // return existing token
        return token.access_token;
      }
    }
    if (getNewToken === true) {
      const url: string = "https://itviya.sas.com/SASLogon/oauth/token";
      let returnObj: any = {};
      return fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa("sas.ec:"),
        },
        body:
          "grant_type=password&response_type=bearer&username=xxxxxx&password=xxxxxxxx",
      })
        .then((response) => response.json())
        .then((responseJson) => {
          returnObj = responseJson;
          returnObj["token_start"] = new Date();
          returnObj["token_end"] = new Date(Date.now() + returnObj.expires_in);
          console.log(returnObj);
          //return returnObj;
          console.log(`Returning SAS Token`);
          getService(Variables).setGlobal("SASToken", returnObj);
          return returnObj.access_token;
          //return returnObj;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //  getSASToken = async (): Promise<string> => {
  //  getFile = async (file, token): Promise<any> => {
  getFile(file, token, objName) {
    console.log(`Getting ${file} Using SAS Rest API`);
    //**************************************** */
    const url: string =
      "https://itviya.sas.com/SASJobExecution/?_PROGRAM=/Corporate%20Services/Travel%20Operations/SAS_Code/sabreApi&&_action=execute&_output_type=json" +
      "&filename=" +
      file;
    //let returnObj: any = [];
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.sas.collection+json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let returnObj = responseJson;
        let loadinfo = {
          objName: objName,
          filename: file,
          refreshed: new Date(),
          count: returnObj.length,
          isLoaded: true,
        };
        console.log(loadinfo);
        getService(Variables).setGlobal(objName, returnObj);
        //console.log(`${objName}=${getService(Variables).getGlobal(objName)}`);

        getService(Variables).appendGlobalUniqueVar("uploads", loadinfo);
        console.log(
          `Finished ${file} Processing SAS Rest API with ${returnObj.length} rows...`
        );
        //return returnObj;
      })
      .catch((err) => {
        console.log(err);
        let loadinfo = {
          objName: objName,
          filename: file,
          refreshed: new Date(),
          count: 0,
          isLoaded: false,
        };
        getService(Variables).appendGlobalUniqueVar("uploads", loadinfo);

        //return err;
      });
  }

  getGlobalVariables() {
    console.log(`Getting Global Variables`);
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetCostcenters.sas",
      "Costcenters"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetProjects.sas",
      "Projects"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetGroups.sas",
      "Groups"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetLodgingLimits.sas",
      "LodgingLimits"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetPreferredHotels.sas",
      "PreferredHotels"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetAgentList.sas",
      "Agents"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetPrefNum.sas",
      "PrefNum"
    );
    getService(CommFoundHelper).getGlobalVariable(
      "sabreGetManagers.sas",
      "Managers"
    );

    let loads = getService(Variables).getGlobal("uploads");
    console.log(`Finished Getting Global Variables ${loads}`);
    //getService(CommFoundHelper).getFile(file, token);
  }

  getGlobalVariable = async (file: string, objName: string): Promise<any> => {
    console.log(`1: Calling Get a Token`);
    // get token key - wait on the response
    try {
      console.log(`2: Inside the try before token`);
      const token = await getService(CommFoundHelper).getSASToken();
      //let next = await token;
      //let token2: string = token.access_token;
      console.log(`3: I should have the token ${token}`);
      console.log(`4: Now go and get ${file}`);
      getService(CommFoundHelper).getFile(file, token, objName);
      console.log(`5: after get file`);
    } catch (err) {
      // handle the error properly
      // {"errorCode":"-300","message":"Job timed out before completion"}
      console.log(err);
    } finally {
      console.log(`6: finished`);
    }

    console.log(`7: ***Outside #1***`);
    // if successful get file

    // then get the file

    // finally send msg to alert agent

    // error handling

    //console.log(`Getting Global Variables=${file}`);
    // look into promise / async / await

    //console.log(`My token is ${token}`);
  };

  handleDuplicates(remarkArray: Array<any>) {
    const theRemarks: Array<any> = remarkArray;
    let duplicates = "";
    let isError: boolean = false;
    console.log(`***searching for duplicates****`);

    theRemarks.forEach((i) => {
      /* loop through all the items in the existing list....
         how many times does the same destination exist already? it should appear only once "as itself"
      */
      // temp var to store the country we are searching for...
      let rmkCode = i.Code;
      let rmkText = i.Text;
      let rmkType = i.Type;
      // search the array to see how many times it exists
      const sameRemarks: any = theRemarks.filter(function (i) {
        return i.Code === rmkCode && i.Text === rmkText && i.Type === rmkType;
      });
      console.log(
        `${sameRemarks.length} entries found for ${rmkCode} ${rmkText}`
      );
      // if it appears more than once (itself) then alert
      if (sameRemarks.length > 1) {
        duplicates = duplicates.concat(", ", rmkCode, rmkText);
      }

      if (duplicates != "") {
        console.log(` STOP: Multiple entries ${duplicates}`);
        isError = true;
      } else {
        isError = false;
      }
      return [isError, duplicates];
    });
  }

  handleRemarkChanges(remarkArray: []) {
    // **************************************************************
    // You must pass in an array containing objects that include ...
    // 1: Type (Alpha-Coded vs. Invoice)
    // 2: Code (letter needed for Alpha Coded)
    // 3: Text (the value of the entire line to be entered)
    // 4: isExisting (boolean)
    // 5: isChange (boolean)
    // 6: Id (number of the existing line)
    // **************************************************************
    console.log(`${remarkArray.length} items to process`);
    console.log(remarkArray);

    let theRemarks: Array<any> = remarkArray;
    let newRemarks: Array<any>;
    let modifiedRemarks: Array<any>;
    let xmlstr: string;
    let isErroronSend: boolean = false;

    // any duplicates?
    // var DuplicateCheck = getService(CommFoundHelper).handleDuplicates(
    //   theRemarks
    // );
    // console.log(DuplicateCheck);

    newRemarks = theRemarks.filter(function (i) {
      return i.isExisting === false;
    });
    if (newRemarks.length > 0) {
      console.log(`There are ${newRemarks.length} that must be added`);
      xmlstr = getService(CommFoundHelper).getXmlPayload("AddRemarkLLSRQ", {
        Remark: () => {
          let strRmk = "";
          for (let i = 0; i < newRemarks.length; i++) {
            // if Code or Text are blank/undefined then error
            if (newRemarks[i].Type === "Alpha-Coded") {
              strRmk = strRmk.concat(
                getService(CommFoundHelper).getXmlPayload("RemarkAlpha", {
                  Code: newRemarks[i].Code,
                  Text: newRemarks[i].Text,
                })
              );
            } else if (newRemarks[i].Type === "Invoice") {
              strRmk = strRmk.concat(
                getService(CommFoundHelper).getXmlPayload("RemarkInvoice", {
                  Text: newRemarks[i].Text,
                })
              );
            }
          }
          return strRmk;
        },
      });
      console.log(xmlstr);

      getService(CommFoundHelper)
        .sendSWSRequest({
          action: "AddRemarkLLSRQ",
          payload: xmlstr,
          authTokenType: "SESSION",
        })
        .then((res) => {
          getService(CommFoundHelper).refreshTripSummary();

          if (res.errorCode !== undefined && res.errorCode !== null) {
            isErroronSend = true;
            getService(IAreaService).showBanner(
              "Error",
              "Failed: ".concat(res.errorCode),
              "***Remark Utility***"
            );
          } else {
            getService(IAreaService).showBanner(
              "Success",
              "Added",
              "***Remark Utility***"
            );
          }
        });
    }
    modifiedRemarks = theRemarks.filter(function (i) {
      return i.isExisting === true && i.isChange === true;
    });
    if (modifiedRemarks.length > 0) {
      console.log(`There are ${modifiedRemarks.length} that must be modified`);

      xmlstr = getService(CommFoundHelper).getXmlPayload("ModifyRemarkLLSRQ", {
        Remark: () => {
          let strRmk = "";
          for (let i = 0; i < modifiedRemarks.length; i++) {
            if (modifiedRemarks[i].Type === "Alpha-Coded") {
              // if Id or Code or Text are blank/undefined then error
              strRmk = strRmk.concat(
                getService(CommFoundHelper).getXmlPayload("RemarkModify", {
                  LineNumber: '"' + modifiedRemarks[i].Id + '"',
                  Code: modifiedRemarks[i].Code,
                  Text: modifiedRemarks[i].Text,
                })
              );
            } else if (modifiedRemarks[i].Type === "Invoice") {
              strRmk = strRmk.concat(
                getService(CommFoundHelper).getXmlPayload(
                  "RemarkModifyInvoice",
                  {
                    LineNumber: '"' + modifiedRemarks[i].Id + '"',
                    Text: modifiedRemarks[i].Text,
                  }
                )
              );
            }
          }
          return strRmk;
        },
      });
      console.log(xmlstr);

      getService(CommFoundHelper)
        .sendSWSRequest({
          action: "ModifyRemarkLLSRQ",
          payload: xmlstr,
          authTokenType: "SESSION",
        })
        .then((res) => {
          getService(CommFoundHelper).refreshTripSummary();
          if (res.errorCode !== undefined && res.errorCode !== null) {
            isErroronSend = true;
            getService(IAreaService).showBanner(
              "Error",
              "Failed: ".concat(res.errorCode),
              "***Remark Utility***"
            );
          } else {
            getService(IAreaService).showBanner(
              "Success",
              "Modified",
              "***Remark Utility***"
            );
          }
        });
    }

    return isErroronSend;
  }

  handleFindUdid = (udid: string, remarkArray: any[]) => {
    // filter as all udids are Invoice Remarks
    const theRemarks: any[] = remarkArray.filter(function (i) {
      return i.Type === "Invoice";
    });
    let udidObject = {
      obj: {},
      udidText: "",
      isExisting: false,
      isChange: false,
      udidPrefix: "S*UD" + udid + " ",
    };
    // my regex to find the Udid
    // let re = /S\*UD([0-9]{1,2})\s(.*)/;
    let re = new RegExp("^S\\*UD" + udid + "\\s(.*)");
    // let re = new RegExp("^S\\*UD1\\s(.*)");
    theRemarks.forEach((i) => {
      //console.log(i.Text);

      //   //var found = re.exec(element.Text);
      //   // const match = element.Text.match(re);
      const match = re.exec(i.Text);
      //console.log(`${match.length} items found for Udid${udid}!`);

      //   /////using variables and groups
      //   //let groups = element.Text.match(re).groups;

      if (match) {
        //console.log(`its a match`);
        console.log(match);
        udidObject.obj = i;
        udidObject.udidText = match[1];
        udidObject.isExisting = true;
      }
    });
    console.log(`Udid${udid} success=${udidObject.isExisting}`);
    return udidObject;
  };
}
