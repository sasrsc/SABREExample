import * as React from "react";
import { Button } from "../../components/Button";
import {
  Col,
  ControlLabel,
  Form,
  FormGroup,
  InputGroup,
  FormControl,
  Glyphicon,
} from "react-bootstrap";

import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { XmlTools } from "../../util/XmlTools";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";

export interface TemplatePopoverProps {
  // keep these
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export class Rmk {
  Type: string;
  Code?: string;
  Id?: number;
  Text: string;
  isChange: boolean;
  isExisting: boolean;
}

export interface TemplatePopoverState {
  // just samples
  actionCode: string;
  payload: string;
  response: any;
  rsfilter: string;
  shouldParse: boolean;
  trippurpose: string;
  trippurposeobj: any;
  projecttask: string;
  projecttaskobj: any;
  trippurposecat: string;
  trippurposecatobj: any;
  groupid: string;
  costcenter: string;
  thisRemarks: any;
}

export class SASUdids extends React.Component<
  TemplatePopoverProps,
  TemplatePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
    trippurpose: "",
    trippurposeobj: {},
    projecttask: "",
    projecttaskobj: {},
    trippurposecat: "",
    trippurposecatobj: {},
    groupid: "",
    costcenter: "",
    thisRemarks: [],
  };

  componentDidMount() {
    console.log("Getting PNR Info....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise.then(this.getRemarks.bind(this)).catch((error) => {
      console.log("Error while receiving reservation");
      console.log(error);
    });
  }
  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  public getRemarks(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"];
    var stmtinfo = reservation.Passengers.Passenger[0].NameReference;
    let stmtinfoParsed = this.cfHelper.parseStatementInfo(stmtinfo);
    console.log(stmtinfoParsed);

    var remarks = reservation.Remarks.Remark;
    const invRemarks: any = remarks.filter(function (i) {
      return i.Type === "Invoice";
    });
    //console.log(invRemarks);
    // *********** Trip Purpose UD1 ****************
    let ud1: any = this.cfHelper.handleFindUdid("1", remarks);
    console.log(ud1);
    if (ud1.isExisting === true) {
      this.setState({ trippurpose: ud1.udidText });
    }
    this.setState({ trippurposeobj: ud1 });
    // *********** Project Task UD3 ****************
    let ud3: any = this.cfHelper.handleFindUdid("3", remarks);
    console.log(ud3);
    if (ud3.isExisting === true) {
      this.setState({ projecttask: ud3.udidText });
    } else {
      //this.setState({ projecttask: "" });
    }
    this.setState({ projecttaskobj: ud3 });
    // *********** Trip Purpose Category UD11 ****************
    let ud11: any = this.cfHelper.handleFindUdid("11", remarks);
    console.log(ud11);
    if (ud11.isExisting === true) {
      //console.log(ud1);

      this.setState({ trippurposecat: ud11.udidText });
      //   this.setState({ trippurposecat: ud11.udidText });
    }
    this.setState({ trippurposecatobj: ud11 });
  }

  //   handleDelete(item: string, e):void {
  //     // get specific remark and delete from state
  //     console.log(`blanks ${item}`);

  //     this.setState({
  //       [item]: "",
  //     });
  //   };

  handleChange(e): void {
    // this handles someone changing an input text field

    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleDelete(whichitem: keyof TemplatePopoverState) {
    // this handles someone changing an input text field
    // currently they can do this with the tp and pt only
    console.log(whichitem);
    this.setState(({
      [whichitem]: "",
    } as unknown) as Pick<TemplatePopoverState, keyof TemplatePopoverState>);
  }

  handleCheck(e): void {
    // this handles someone clicked on the checkbox/dropdown
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }

  handleExecute(): void {
    console.log(`This is what happens when I hit submit`);
    // some code
    // get each udid's current state and now update each object with that new value
    let toSend: any = [];

    if (this.state.trippurpose !== this.state.trippurposeobj.udidText) {
      console.log(`Trip Purpose has changed`);
      let tp = {
        Type: "Invoice",
        Text: this.state.trippurposeobj.udidPrefix + this.state.trippurpose,
        isExisting: this.state.trippurposeobj.isExisting,
        isChange: true,
        Id: this.state.trippurposeobj.obj.Id,
      };
      toSend.push(tp);
    }
    if (this.state.projecttask !== this.state.projecttaskobj.udidText) {
      console.log(`Project Task has changed`);
      let pt = {
        Type: "Invoice",
        Text: this.state.projecttaskobj.udidPrefix + this.state.projecttask,
        isExisting: this.state.projecttaskobj.isExisting,
        isChange: true,
        Id: this.state.projecttaskobj.obj.Id,
      };
      toSend.push(pt);
    }
    if (this.state.trippurposecat !== this.state.trippurposecatobj.udidText) {
      console.log(`TPC has changed`);
      let tpc = {
        Type: "Invoice",
        Text:
          this.state.trippurposecatobj.udidPrefix + this.state.trippurposecat,
        isExisting: this.state.trippurposecatobj.isExisting,
        isChange: true,
        Id: this.state.trippurposecatobj.obj.Id,
      };
      toSend.push(tpc);
    }

    console.log(toSend);

    var remarksFail = this.cfHelper.handleRemarkChanges(toSend);
    console.log(`Now close the window ${remarksFail}`);

    this.props.handleClose();
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
        title="Execute"
        handleClick={this.handleExecute}
      />,
    ];
  }
  render(): JSX.Element {
    return (
      <PopoverFormSAS
        name=""
        title="UDID Change"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <Form>
          <div key="TP" className="form-row">
            <div className="form-group col-md-3">Trip Purpose UD1</div>
            <div className="form-group col-md-8">
              <input
                name="trippurpose"
                type="text"
                className="form-control"
                value={this.state.trippurpose}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-1">
              <i
                className="fa fa-trash-alt"
                onClick={() => this.handleDelete("trippurpose")}
              />
            </div>
          </div>
          <div key="PT" className="form-row">
            <div className="form-group col-md-3">Project Task UD3</div>
            <div className="form-group col-md-8">
              <input
                name="projecttask"
                type="text"
                className="form-control"
                value={this.state.projecttask}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-1">
              <i
                className="fa fa-trash-alt"
                onClick={() => this.handleDelete("projecttask")}
                //onClick={this.handleDelete("projecttask")}
              />
            </div>
          </div>

          <div key="TPC" className="form-row">
            <div className="form-group col-md-3">
              Trip Purpose Category UD11
            </div>
            <div className="form-group col-md-8">
              <select
                name="trippurposecat"
                className="form-control"
                value={this.state.trippurposecat}
                onChange={this.handleChange.bind(this)}
              >
                <option value="">Choose</option>
                <option value="CUSTOMER TRAVEL NON PROJECT">
                  Customer Travel Non Project
                </option>
                <option value="PROJECT CUSTOMER TRAVEL BILLABLE">
                  Project Customer Travel Billable
                </option>
                <option value="PROJECT CUSTOMER TRAVEL NON BILLABLE">
                  Project Customer Non Billable
                </option>
                <option value="INTERNAL MEETINGS">Internal Meetings</option>
                <option value="SAS HOSTED EVENTS">SAS Hosted Events</option>
                <option value="NON SAS HOSTED EVENTS">
                  Non SAS Hosted Events
                </option>
                <option value="EMPLOYEE TRAINING">Employee Training</option>
                <option value="INTERNAL PROJECTS AND DELIVERABLES">
                  Internal Projects and Deliverables
                </option>
              </select>
            </div>
          </div>
        </Form>
      </PopoverFormSAS>
    );
  }
}
