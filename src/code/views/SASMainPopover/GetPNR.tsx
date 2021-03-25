import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { InputGroup } from "../../components/InputGroup";
import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { XmlTools } from "../../util/XmlTools";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import * as XML2JS from "xml2js";

export interface TemplatePopoverProps {
  // keep these
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export class AcLine {
  AirlineDesignator: string;
  DocumentNumber: string;
}

export interface TemplatePopoverState {
  // just samples
  actionCode: string;
  payload: string;
  response: any;
  responseStr: string;
  rsfilter: string;
  shouldParse: boolean;
  pnr: any;
  pnrraw: any;
  AcLines: Array<AcLine>;
}

export class GetPNR extends React.Component<
  TemplatePopoverProps,
  TemplatePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  state: TemplatePopoverState = {
    // just samples
    actionCode: "",
    payload: "",
    response: "",
    rsfilter: "",
    shouldParse: false,
    pnr: {},
    pnrraw: {},
    responseStr: "",
    AcLines: [],
  };
  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  handleChange(e): void {
    // this handles someone changing an input text field
    this.setState({ [e.target.name]: e.target.value });
  }
  handleCheck(e): void {
    // this handles someone clicked on the checkbox
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }

  handleExecute(): void {
    console.log(`Get PNR`);
    // some code
    var sendToSabre = this.cfHelper.getXmlPayload("GetAccountingLinesRQ", {});
    // our packet to send
    console.log(sendToSabre);

    getService(CommFoundHelper)
      .sendSWSRequest({
        action: "GetReservationRQ",
        payload: sendToSabre,
        authTokenType: "SESSION",
      })
      .then((res) => {
        // this is the soapRs
        let thexml = res.value;
        const parser = new DOMParser();
        const xml = parser.parseFromString(thexml, "application/xml");
        let aclines: any = xml.getElementsByTagName("stl19:AccountingLines")[0]
          .childNodes;
        console.log(aclines);
        console.log(`There are ${aclines.length} AC Lines in this PNR`);
        let acs: any = [];
        let acline = new AcLine();
        aclines.forEach((i) => {
          console.log(i);
          let acline = new AcLine();
          // this will get the airline for the ac line
          acline.AirlineDesignator = i.getElementsByTagName([
            "stl19:AirlineDesignator",
          ])[0].childNodes[0].nodeValue;
          acline.DocumentNumber = i.getElementsByTagName([
            "stl19:DocumentNumber",
          ])[0].childNodes[0].nodeValue;
          console.log(`${acline}`);
          // need to test multiple ac lines
          acs.push(acline);
        });
        console.log(acs);
        this.setState({
          AcLines: acs,
        });

        // // placeholder for json version of the xml
        // let thejsonversion = {};

        // // try XML2JS
        // var parseString = require("xml2js").parseString;
        // parseString(thexml, function (err, result) {
        //   console.dir(result);
        //   thejsonversion = JSON.stringify(result);
        //   // this is a json version but pretty ugly
        //   console.log(thejsonversion);
        //   // this is the original xml
        //   console.log(result);
        //   // what version of the GetReservationRQ
        //   //console.log(thejsonversion["stl19:GetReservationRS"]["$"]["Version"]);
        // });
      });
    // what version of the GetReservationRQ
    //how many accounting lines
  }

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="Cancel"
        handleClick={this.props.handleClose}
      />,
      <Button
        name="btnExecute"
        type="primary"
        title="Get PNR"
        handleClick={this.handleExecute}
      />,
    ];
  }
  render(): JSX.Element {
    return (
      <PopoverFormSAS
        name=""
        title="Get Full PNR"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <p>If you have a PNR displayed this will get the current pnr</p>
        {/* this uses the input component in the \components directory */}
      </PopoverFormSAS>
    );
  }
}
