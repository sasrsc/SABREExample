import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Select } from "../../components/Select";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import { PnrPublicService } from "sabre-ngv-app/app/services/impl/PnrPublicService";

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
  empno: string;
  costcent: string;
  fop: string;
  vip: string;
  grp: string;
  superpnr: string;
  superpnrobj: any;
  stmtInfo: any;
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
    this.handleErase = this.handleErase.bind(this);
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
    empno: "",
    costcent: "",
    fop: "",
    vip: "",
    grp: "",
    superpnr: "",
    superpnrobj: {},
    stmtInfo: {},
  };

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

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

  public getRemarks(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"];
    var stmtinfo = reservation.Passengers.Passenger[0].NameReference;
    let stmtinfoParsed = this.cfHelper.parseStatementInfo(stmtinfo);
    console.log(stmtinfoParsed);
    this.setState({
      stmtInfo: stmtinfoParsed,
      fop: stmtinfoParsed.fop,
      empno: stmtinfoParsed.empno,
      costcent: stmtinfoParsed.costcent,
      vip: stmtinfoParsed.vip,
      grp: stmtinfoParsed.group,
    });

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

    // *********** Super PNR UD6 ****************
    let ud6: any = this.cfHelper.handleFindUdid("6", remarks);
    if (ud6.isExisting === true) {
      this.setState({ superpnr: ud6.udidText });
    }
    this.setState({ superpnrobj: ud6 });
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
    // super pnr and proj tast only
    // 1. this blanks out the value in state
    // 2. need to delete from pnr if already existed
    console.log(`Need to erase/delete ${whichitem}`);
    let handlethisitem = whichitem + "obj";

    this.setState(({
      [whichitem]: "",
    } as unknown) as Pick<TemplatePopoverState, keyof TemplatePopoverState>);
    // but delete from the pnr
    // pass the line to helper
    if (this.state[handlethisitem].isExisting === true) {
      console.log(`${whichitem} is in the PNR so delete.`);
      let id: string = this.state[handlethisitem].obj.Id;
      var deleteRmk = this.cfHelper.getXmlPayload("DeleteRemark", {
        LineNumber: '"' + id + '"',
      });
      console.log(deleteRmk);

      // delete the remark in the pnr
      getService(CommFoundHelper)
        .sendSWSRequest({
          action: "ModifyRemarkLLSRQ",
          payload: deleteRmk,
          authTokenType: "SESSION",
        })
        .then((res) => {
          this.setState({
            response: res.errorCode ? JSON.stringify(res, null, 2) : res.value,
          });
        });
    } else {
      console.log(`${whichitem} didn't exist previously so no need to delete.`);
    }
    // let id: string = "";
    // if (whichitem === "projecttask" && this.state.projecttaskobj.isExisting===true) {
    //   //
    //   id = this.state.projecttaskobj.obj.Id;
    // } else if (
    //   whichitem === "superpnr" &&
    //   this.state.superpnrobj.isExisting === true
    // ) {
    //   //
    //   id = this.state.superpnrobj.obj.Id;
    // }

    // create xml to delete the item from the face of the pnr if it was in there in the beginning ...
  }

  handleErase(whichitem: keyof TemplatePopoverState) {
    // trip purpose
    // currently they can do this with the tp and pt only
    // this blanks out the value in state but NOT delete
    console.log(`Need to erase ${whichitem} value`);
    this.setState(({
      [whichitem]: "",
    } as unknown) as Pick<TemplatePopoverState, keyof TemplatePopoverState>);
    // but
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

    if (
      this.state.trippurpose !== this.state.trippurposeobj.udidText &&
      this.state.trippurpose !== ""
    ) {
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
    if (
      this.state.projecttask !== this.state.projecttaskobj.udidText &&
      this.state.projecttask !== ""
    ) {
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
    if (
      this.state.superpnr !== this.state.superpnrobj.udidText &&
      this.state.superpnr !== ""
    ) {
      console.log(`Super PNR has changed`);
      let tpc = {
        Type: "Invoice",
        Text: this.state.superpnrobj.udidPrefix + this.state.superpnr,
        isExisting: this.state.superpnrobj.isExisting,
        isChange: true,
        Id: this.state.superpnrobj.obj.Id,
      };
      toSend.push(tpc);
    }

    console.log(toSend);

    var remarksFail = this.cfHelper.handleRemarkChanges(toSend);
    console.log(`Now close the window ${remarksFail}`);

    // handle the stmt info if anything has changed...
    if (
      this.state.fop !== this.state.stmtInfo.fop ||
      this.state.empno !== this.state.stmtInfo.empno ||
      this.state.costcent !== this.state.stmtInfo.costcent ||
      this.state.vip !== this.state.stmtInfo.vip ||
      this.state.grp !== this.state.stmtInfo.group
    ) {
      // update stmt info
      console.log(`Stmt Info has changed!`);
      // this has to be done with Native Command per SABRE 4/1/21

      let sendtoSABRE = this.cfHelper.createStatementInfoEntry(
        this.state.fop,
        this.state.empno,
        this.state.costcent,
        this.state.vip,
        this.state.grp
      );
      this.cfHelper
        .sendCommandMessage(sendtoSABRE, true, true)
        .then((res) => {});

      // now send it (don't know if this works - have asked sabre)
    }
    this.cfHelper.refreshTripSummary();
    this.props.handleClose();
    //this.cfHelper.displayGraphicalPnr();
    getService(PnrPublicService).displayGraphicalPnr("itinerary");
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
          <div key="StmtInfo" className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="fop" className="form-label">
                FOP
              </label>
              <select
                name="fop"
                className="form-control"
                value={this.state.fop}
                onChange={this.handleChange}
              >
                <option value="SAS">SAS</option>
                <option value="IDS">IDS</option>
                <option value="FOP">FOP</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="empno" className="form-label">
                Emp #
              </label>
              <input
                type="text"
                required
                name="empno"
                className="form-control text-uppercase"
                value={this.state.empno}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="costcent" className="form-label">
                Costcent
              </label>
              <input
                type="text"
                required
                name="costcent"
                className="form-control text-uppercase"
                value={this.state.costcent}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="vip" className="form-label">
                VIP
              </label>
              <select
                name="vip"
                className="form-control"
                value={this.state.vip}
                onChange={this.handleChange}
              >
                <option value="">No</option>
                <option value="VIP">Yes</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="grp" className="form-label">
                Group
              </label>
              <select
                name="grp"
                className="form-control"
                value={this.state.grp}
                onChange={this.handleChange}
              >
                <option value="">No</option>
                <option value="GRP">Yes</option>
              </select>
            </div>
          </div>
          <div key="TP" className="form-row">
            <div className="form-group col-md-3">Trip Purpose UD1</div>
            <div className="form-group col-md-8">
              <input
                name="trippurpose"
                type="text"
                required
                className="form-control"
                maxLength={63}
                value={this.state.trippurpose}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-1">
              <i
                className="fa fa-eraser"
                onClick={() => this.handleErase("trippurpose")}
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
                required
                value={this.state.trippurposecat}
                onChange={this.handleChange}
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
          <div key="SuperPnr" className="form-row">
            <div className="form-group col-md-3">Super PNR UD6</div>
            <div className="form-group col-md-8">
              <input
                name="superpnr"
                type="text"
                maxLength={63}
                className="form-control"
                value={this.state.superpnr}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-1">
              <i
                className="fa fa-trash-alt"
                onClick={() => this.handleDelete("superpnr")}
                //onClick={this.handleDelete("projecttask")}
              />
            </div>
          </div>
        </Form>
      </PopoverFormSAS>
    );
  }
}
