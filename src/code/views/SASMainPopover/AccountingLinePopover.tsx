import * as React from "react";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { InputGroup } from "../../components/InputGroup";
import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import {
  Alert,
  Button as BtnBs,
  FormGroup,
  FormControl,
  Checkbox,
} from "react-bootstrap";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";

export interface TemplatePopoverProps {
  // keep these
  handleClose?: () => void;
  navigation?: JSX.Element;
}
export class AcctingLine {
  Id: number;
  Airline: string;
  TicketNumber: string;
  FOP: string;
  CreditCardNumber?: string;
  CreditCardCode?: string;
  LastNameFirstInitial?: string;
  LastName?: string;
  FirstInitial?: string;
  PaxNumber?: string;
  BaseFare: number;
  useCC?: boolean;
  Tax: number;
  Commission: number;
  FareApplication: string;
  NumberOfConjunctedDocuments: string;
  TariffBasis: string;
  FreeFormText?: string;
  isChange: boolean;
  isExisting: boolean;
}

export class ErrorMessage {
  Message: string;
  Code: string;
  Severity: string;
}

export interface TemplatePopoverState {
  // your state variables
  actionCode: string;
  payload: string;
  response: any;
  isSuccess: boolean;
  rsfilter: string;
  shouldParse: boolean;
  AccountingLineList: Array<AcctingLine>;
  acindex: number;
  show: boolean;
  paxList: any;
}

export class AccountingLinePopover extends React.Component<
  TemplatePopoverProps,
  TemplatePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCalculatedTotal = this.handleCalculatedTotal.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.getAcLines = this.getAcLines.bind(this);
  }

  state: TemplatePopoverState = {
    // just samples
    actionCode: "",
    payload: "",
    response: "",
    rsfilter: "",
    AccountingLineList: [],
    shouldParse: false,
    acindex: 1000,
    isSuccess: false,
    show: false,
    paxList: [],
  };

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  componentDidMount(): void {
    console.log(`Accounting Popover Loading`);
    // is there a current active pnr?
    this.getReservation();
  }

  private getReservation(): void {
    console.log("Retrieving Reservation");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise.then(this.getAcLines).catch((error) => {
      console.log("Error while receiving reservation or No Res Exists");
      console.log(error);
    });
  }

  getAcLines(): void {
    console.log(`Get Latest AC List`);
    //get accounting lines
    let getPNR = this.cfHelper.getXmlPayload("GetReservationRQ", {});
    console.log(getPNR);
    getService(CommFoundHelper)
      .sendSWSRequest({
        action: "GetReservationRQ",
        payload: getPNR,
        authTokenType: "SESSION",
      })
      .then((res) => {
        let thexml = res.value;
        const parser = new DOMParser();
        const xml = parser.parseFromString(thexml, "application/xml");
        let errors: any = xml.getElementsByTagName("stl19:Errors");
        if (errors.length > 0) {
          // some error ...
          let error = new ErrorMessage();
          (error.Message = this.cfHelper.getXmlTagValue(errors, [
            "stl19:Message",
          ])),
            (error.Code = this.cfHelper.getXmlTagValue(errors, ["stl19:Code"])),
            (error.Severity = this.cfHelper.getXmlTagValue(errors, [
              "stl19:Severity",
            ])),
            console.log(error);
        }

        console.log(res);

        // check for messages
        if (res.errorCode !== undefined && res.errorCode !== null) {
          console.log(`errors!!!!`);
        } else {
          let pax = this.cfHelper.getPaxArrayFromXml(xml);
          console.log(pax);
          this.setState({
            paxList: pax,
          });
          let aclines2: any = xml.getElementsByTagName("stl19:AccountingLines");
          console.log(aclines2);

          let aclines: any = xml.getElementsByTagName(
            "stl19:AccountingLines"
          )[0].childNodes;
          console.log(aclines);
          console.log(`There are ${aclines.length} AC Lines in this PNR`);
          let acs: any = [];

          aclines.forEach((i) => {
            console.log(i);
            let acline = new AcctingLine();
            // this will get the values in the xml for each element in the ac line using helper function

            // the index value is the ac line number in sabre ac1, it is needed ...
            (acline.Id = parseFloat(
              this.cfHelper.getXmlAttributeValue(i, "index")
            )),
              (acline.Airline = this.cfHelper.getXmlTagValue(i, [
                "stl19:AirlineDesignator",
              ])),
              (acline.TicketNumber = this.cfHelper.getXmlTagValue(i, [
                "stl19:DocumentNumber",
              ])),
              (acline.FOP = this.cfHelper.getXmlTagValue(i, [
                "stl19:FormOfPaymentCode",
              ])),
              (acline.LastNameFirstInitial = this.cfHelper.getXmlTagValue(i, [
                "stl19:PassengerName",
              ])),
              // left of the space
              (acline.LastName = acline.LastNameFirstInitial.substr(
                0,
                acline.LastNameFirstInitial.indexOf(" ")
              )),
              // right of the space
              (acline.FirstInitial = acline.LastNameFirstInitial.substr(
                acline.LastNameFirstInitial.indexOf(" ") + 1
              )),
              (acline.BaseFare = parseFloat(
                this.cfHelper.getXmlTagValue(i, ["stl19:BaseFare"])
              )),
              (acline.Tax = parseFloat(
                this.cfHelper.getXmlTagValue(i, ["stl19:TaxAmount"])
              )),
              (acline.Commission = parseFloat(
                this.cfHelper.getXmlTagValue(i, ["stl19:CommissionAmount"])
              )),
              (acline.FareApplication = this.cfHelper.getXmlTagValue(i, [
                "stl19:FareApplication",
              ])),
              (acline.NumberOfConjunctedDocuments = this.cfHelper.getXmlTagValue(
                i,
                ["stl19:NumberOfConjunctedDocuments"]
              )),
              (acline.TariffBasis = this.cfHelper.getXmlTagValue(i, [
                "stl19:TarriffBasis",
              ])),
              (acline.CreditCardCode = this.cfHelper.getXmlTagValue(i, [
                "stl19:CreditCardCode",
              ])),
              (acline.CreditCardNumber = this.cfHelper.getXmlTagValue(i, [
                "stl19:CreditCardNumber",
              ])),
              (acline.FreeFormText = this.cfHelper.getXmlTagValue(i, [
                "stl19:FreeFormText",
              ])),
              (acline.isChange = false),
              (acline.isExisting = true),
              console.log(`${acline}`);
            // need to test multiple ac lines
            acs.push(acline);
          });
          console.log(acs);
          this.setState({
            AccountingLineList: acs,
          });
        }
      });
  }

  handleDismiss() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleChange = (id: number) => (e): void => {
    // this handles someone changing an input or select text field
    // but also as the values are in an array it has to locate the correct one
    const doc = this.state.AccountingLineList.map((i) =>
      i.Id == id
        ? {
            ...i,
            [e.target.name]: e.target.value.toUpperCase().trim(),
            isChange: true,
          }
        : i
    );

    this.setState({
      AccountingLineList: doc,
    });
  };

  handleCheck = (id: number) => (e): void => {
    // this handles someone clicked on the checkbox
    //this.setState({ [e.target.name]: !this.state[e.target.name] });
    console.log(`${e.target.name} change to ${e.target.value}`);
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    const doc = this.state.AccountingLineList.map((i) =>
      i.Id == id
        ? {
            ...i,
            // [e.target.name]: !this.state[e.target.name],
            name: value,
            isChange: true,
          }
        : i
    );

    this.setState({
      AccountingLineList: doc,
    });
  };

  handleDelete = (id: number, isExisting: boolean) => (e): void => {
    console.log(`**** Delete line ${id} ****`);

    if (isExisting === true) {
      // need to remove from sabre too which will refresh the component
      // delete accounting line using LL entry
      let sabreEntry: string = "AC" + id + "¤";

      this.cfHelper.sendCommandMessage(sabreEntry, true, true).then((res) => {
        /// refresh ...
        console.log(res);
        // this fixes a bug with sabre showing success as true when it did not delete the line
        let success: boolean = false;
        if (
          res.Status.Messages[0].Text.indexOf("*") > 0 &&
          res.Status.Success !== false
        ) {
          success = true;
        } else {
          success = false;
        }
        // if you refresh the ac lines then the component will re-render
        this.getAcLines();
        // display message about status of delete action
        this.setState({
          response: res.Status.Messages[0].Text,
          isSuccess: res.Status.Success,
          show: true,
        });
      });
    } else {
      // just delete from the array without doing anything in sabre...
      let doclist = this.state.AccountingLineList;
      let itemtodelete: number = null;
      // get the isExisting value as needed for any deletions
      doclist.forEach((i, index) => {
        if (i.Id == id) {
          itemtodelete = index;
        }
      });

      // remove from our temp list
      doclist.splice(itemtodelete, 1);

      // update state to reflect the item being removed
      this.setState({
        AccountingLineList: doclist,
      });
    }
  };

  handleAdd(e): void {
    let next = this.state.acindex + 1;
    //get the values from the last item in the array to pre populate the new item

    //add another row to our array
    this.setState((prevState) => ({
      AccountingLineList: [
        ...prevState.AccountingLineList,
        {
          Id: next,
          isExisting: false,
          isChange: false,
          Airline: "",
          TicketNumber: "",
          FOP: "",
          CreditCardCode: "",
          CreditCardNumber: "",
          LastName: "",
          FirstInitial: "",
          PaxNumber: this.state.paxList[0].Number,
          BaseFare: 0,
          Tax: 0,
          Commission: 0,
          FareApplication: "",
          NumberOfConjunctedDocuments: "",
          TariffBasis: "",
          FreeFormText: "",
          useCC: true,
        },
      ],
    }));
    //increase the value of last segment index

    this.setState({
      acindex: next + 1,
    });
  }

  handleCalculatedTotal(base, tax) {
    let total = parseFloat(base) + parseFloat(tax);
    return total.toFixed(2);
  }

  handleExecute(): void {
    console.log(`This is what happens when I hit submit`);
    let sendApi: any;
    // AddAccountingLineLLSRQ
    // https://developer.sabre.com/docs/soap_apis/management/itinerary/Add_Accounting_Line
    //files.developer.sabre.com/drc/servicedoc/AddAccountingLineLLSRQ_v2.0.0_Sample_Payloads.xml
    //AC/WN/[WNTKT]/0.00/[TOTAMT]/0.00/ONE/CX[FOP] 1.1[LAST] [FIRST]/1/D/E-V-WN

    // loop through all lines and get those where isExisting = false
    let newAcLines = this.state.AccountingLineList.filter(
      (i) => i.isExisting === false
    );
    // now loop through it to produce the necessary ac line
    sendApi = this.cfHelper.getXmlPayload("AddAccountingLineRQ", {
      AccountingLine: () => {
        let strRmk = "";
        for (let i = 0; i < newAcLines.length; i++) {
          strRmk = strRmk.concat(
            this.cfHelper.getXmlPayload("NonInteractiveElectronicTicket", {
              BaseFare: newAcLines[i].BaseFare,
              Tax: newAcLines[i].Tax,
              Commission: newAcLines[i].Commission,
              Airline: newAcLines[i].Airline,
              TicketNumber: newAcLines[i].TicketNumber,
              LastName: newAcLines[i].LastName,
              FirstInitial: newAcLines[i].FirstInitial,
              FOP: newAcLines[i].FOP,
              CreditCardCode: newAcLines[i].CreditCardCode,
              CreditCardNumber: newAcLines[i].CreditCardNumber,
            })
          );
        }
        return strRmk;
      },
    });

    console.log(sendApi);

    // getService(CommFoundHelper)
    //   .sendSWSRequest({
    //     action: "AddAccountingLineLLSRQ",
    //     payload: sendApi,
    //     authTokenType: "SESSION",
    //   })
    //   .then((res) => {
    //     this.setState({
    //       response: res.errorCode ? JSON.stringify(res, null, 2) : res.value,
    //     });
    //     getService(CommFoundHelper).refreshTripSummary();
    //     if (res.errorCode !== undefined && res.errorCode !== null) {
    //       getService(IAreaService).showBanner(
    //         "Error",
    //         "Failed: ".concat(res.errorCode),
    //         "Accounting Lines"
    //       );
    //     } else {
    //       getService(IAreaService).showBanner(
    //         "Success",
    //         "Added",
    //         "Accounting Lines"
    //       );
    //     }
    //     this.props.handleClose();
    //   });

    // console.log(newAcLines);

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
    let responseOutput;
    if (this.state.show) {
      if (this.state.response !== "" && this.state.isSuccess === true) {
        setTimeout(() => this.setState({ show: false }), 3000);
        responseOutput = (
          <Alert bsStyle="info" onDismiss={this.handleDismiss}>
            <h4>
              <i className="fa fa-info-circle"></i> Deleted!
            </h4>
            <p>{this.state.isSuccess + ": " + this.state.response}</p>
          </Alert>
        );
      } else if (this.state.response !== "" && this.state.isSuccess === false) {
        responseOutput = (
          <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
            <h4>
              <i className="fa fa-exclamation-triangle"></i> Oh snap! You got an
              error!
            </h4>
            <p>{this.state.isSuccess + ": " + this.state.response}</p>
          </Alert>
        );
      }
    }

    return (
      <PopoverFormSAS
        name=""
        title="Manual Accounting Line"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <div className="sas-main-popover-accounting-line">
          <form noValidate onSubmit={this.handleExecute} autoComplete="off">
            <table className="table">
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Ticket Number</th>
                  <th>FOP</th>
                  <th>Name</th>
                  <th>Base Fare</th>
                  <th>Tax</th>
                  <th>Total</th>
                  <th>Commission</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {this.state.AccountingLineList.map((s) => (
                  <tr key={s.Id}>
                    <td>
                      <FormControl
                        type="text"
                        name="Airline"
                        value={s.Airline}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>

                    <td>
                      <FormControl
                        type="text"
                        name="TicketNumber"
                        value={s.TicketNumber}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="text"
                        name="FOP"
                        value={s.FOP}
                        onChange={this.handleChange(s.Id)}
                      />

                      <input
                        type="checkbox"
                        name="useCC"
                        checked={s.useCC}
                        onChange={this.handleCheck(s.Id)}
                      />
                    </td>

                    <td>
                      <select
                        name="PaxNumber"
                        className="form-control"
                        onChange={this.handleChange(s.Id)}
                      >
                        {this.state.paxList.map((i) => (
                          <option key={i.Number} value={i.Number}>
                            {i.LastName} {i.FirstInitial} {i.Number}
                          </option>
                        ))}
                      </select>
                      {/* <FormControl
                        type="text"
                        name="LastNameFirstInitial"
                        placeholder="LastName FirstInitial"
                        value={s.LastNameFirstInitial}
                        onChange={this.handleChange(s.Id)}
                      /> */}
                      {/* <FormControl
                        type="text"
                        name="LastName"
                        placeholder="LastName"
                        value={s.LastName}
                        onChange={this.handleChange(s.Id)}
                      />
                      <FormControl
                        type="text"
                        name="FirstInitial"
                        placeholder="Initial"
                        value={s.FirstInitial}
                        onChange={this.handleChange(s.Id)}
                      /> */}
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        name="BaseFare"
                        required
                        value={s.BaseFare}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>
                    <td>
                      <FormControl
                        type="number"
                        name="Tax"
                        value={s.Tax}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>

                    <td>{this.handleCalculatedTotal(s.BaseFare, s.Tax)}</td>
                    <td>
                      <FormControl
                        type="number"
                        name="Commission"
                        value={s.Commission}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>
                    <td>
                      <i
                        className="fa fa-trash-alt"
                        onClick={this.handleDelete(s.Id, s.isExisting)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {responseOutput}
            <div className="row">
              <BtnBs onClick={this.handleAdd}>
                <i className="fa fa-plus"></i>
              </BtnBs>
            </div>
          </form>
        </div>
      </PopoverFormSAS>
    );
  }
}
