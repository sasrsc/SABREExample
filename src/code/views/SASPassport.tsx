import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { CommFoundHelper } from "../services/CommFoundHelper";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";
import {
  Alert,
  Panel,
  Badge,
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
} from "react-bootstrap";

const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface PassportVisaItem {
  Id: number;
  Existing: boolean;
  Citizenship: string;
  CountryDestination: string;
  NeedPassport: string;
  NeedVisa: string;
  HavePassport: string;
  HaveVisa: string;
  PrimaryDocument?: string;
  PassportExpSoon?: string;
  DocumentType?: string;
  isChange: boolean;
}
//create and defind var
export interface OwnState {
  lastPassVisaDocIndex: number;
  remarksList: any;
  premarksList: any;
  headerText: string;
  errorMessage: string;
  isError: boolean;

  response: any;
  PassportVisaDocList: Array<PassportVisaItem>;
}

export class SASPassport extends React.Component<{}, OwnState> {
  constructor(props = {}) {
    super(props);
    this.state = {
      PassportVisaDocList: [
        {
          Id: 1000,
          Existing: false,
          Citizenship: "",
          CountryDestination: "",
          NeedPassport: "",
          NeedVisa: "",
          HavePassport: "",
          HaveVisa: "",
          PrimaryDocument: "",
          PassportExpSoon: "",
          DocumentType: "",
          isChange: true,
        },
      ],
      headerText: "Add Passport/Visa Documentation",
      lastPassVisaDocIndex: 1001,
      remarksList: [],
      premarksList: [],
      errorMessage: "",
      response: "",
      isError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.closePopovers = this.closePopovers.bind(this);
    this.getRemarks = this.getRemarks.bind(this);
  }

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  componentDidMount() {
    console.log("Searching for P¥ ....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise.then(this.getRemarks.bind(this)).catch((error) => {
      console.log("Error while receiving reservation");
      console.log(error);
    });
  }

  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  private addDocument() {
    let next = this.state.lastPassVisaDocIndex;
    //get the values from the last item in the array to pre populate the new item
    let lastitem = this.state.PassportVisaDocList[
      this.state.PassportVisaDocList.length - 1
    ];
    //add another row to our array
    this.setState((prevState) => ({
      PassportVisaDocList: [
        ...prevState.PassportVisaDocList,
        {
          Id: next + 1,
          Existing: false,
          Citizenship: lastitem.Citizenship,
          CountryDestination: "",
          NeedPassport: "",
          NeedVisa: "",
          HavePassport: lastitem.HavePassport,
          HaveVisa: "",
          PrimaryDocument: lastitem.PrimaryDocument,
          PassportExpSoon: lastitem.PassportExpSoon,
          DocumentType: lastitem.DocumentType,
          isChange: true,
        },
      ],
    }));
    //increase the value of last segment index

    this.setState({
      lastPassVisaDocIndex: next + 1,
    });
  }
  private handleChange = (id: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase();
    console.log(`${name} has changed to ${value}`);

    const doc = this.state.PassportVisaDocList.map((i) =>
      i.Id == id ? { ...i, [name]: value, isChange: true } : i
    );

    this.setState({
      PassportVisaDocList: doc,
    });
  };

  private handleChangeSelect = (id: number) => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    const doc = this.state.PassportVisaDocList.map((i) =>
      i.Id == id ? { ...i, [name]: value } : i
    );

    this.setState({
      PassportVisaDocList: doc,
    });
  };

  private handleDeleteDoc = (id: number) => (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    let doclist = this.state.PassportVisaDocList;
    //    console.log(`${value}, ${name}, ${id}`);
    let itemtodelete: number = null;
    doclist.forEach((i, index) => {
      if (i.Id == id) {
        itemtodelete = index;
      }
    });

    doclist.splice(itemtodelete, 1);

    this.setState({
      PassportVisaDocList: doclist,
    });
    this.checkMultipleCountries();
  };

  private checkMultipleCountries() {
    const localcopy = this.state.PassportVisaDocList;
    let duplicates = "";
    let isError: boolean = false;

    this.state.PassportVisaDocList.forEach((i) => {
      /* loop through all the items in the list....
                          does the same destination exist already?
              */

      let countrydestination = i.CountryDestination.trim();

      const sameDestination: any = localcopy.filter(function (i) {
        return i.CountryDestination === countrydestination;
      });
      console.log(
        `${sameDestination.length} entries found for ${countrydestination}`
      );

      if (sameDestination.length > 1) {
        duplicates = duplicates += countrydestination;
      }
    });

    if (duplicates != "") {
      console.log(`STOP: multiple entries ${duplicates}`);
      let msg: string = `STOP: You can't enter the same country multiple times (${duplicates})`;
      isError = true;
      this.setState({
        errorMessage: msg,
        isError: isError,
      });
    } else {
      isError = false;
      this.setState({
        errorMessage: "",
        isError: isError,
      });
    }
    return isError;
  }

  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("This is what happens when I click on the PassportVisa button");
    this.state.PassportVisaDocList.forEach((i) => {
      /* loop through all the items in the list....
            NEW LINE?
            is it a valid line? !!!!this should be controlled by form validation!!!!!
            does the same destination exist already?
            if not add
            EXISTING LINE?
            is it a valid line? !!!!this should be controlled by form validation!!!!!
            has it changed?
        */
      let countrydestination = i.CountryDestination.trim();
      let qcFailed = this.checkMultipleCountries();
      console.log(qcFailed);

      if (qcFailed) {
        console.log(` **** STOP ***** `);
      } else {
        let citizenship = i.Citizenship.trim();
        let havePassport = i.HavePassport;
        let haveVisa = i.HaveVisa;
        let needPassport = i.NeedPassport;
        let needVisa = i.NeedVisa;
        let passportExp = i.PassportExpSoon;
        let primaryDocument = i.PrimaryDocument;
        let documentType = i.DocumentType;
        let existing = i.Existing;
        let beginning: string = "";
        if (existing === true) {
          beginning = "5" + i.Id + "¤P¥";
        } else {
          beginning = "5P¥";
        }
        let pdocentry: string =
          beginning +
          citizenship +
          "/NA-" +
          countrydestination +
          "/P-" +
          needPassport +
          "/V-" +
          needVisa +
          "/PS-" +
          havePassport +
          "/VS-" +
          haveVisa +
          "/PD-" +
          primaryDocument +
          "/EXP-" +
          passportExp +
          "/D-" +
          documentType;

        getService(NativeSabreCommand).handleSubmit(pdocentry);

        let createRmk = `<AddRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.1.1">
<RemarkInfo>
<Remark Code="P" Type="Alpha-Coded">
<Text>COMMAND ADDED VIA SOAP</Text>
</Remark>
</RemarkInfo>
</AddRemarkRQ>`;

        /*

          "Remark" :
        '<Remark Type="General">'
		    +'<Text>'
        +'{Text}'
		    +'</Text>'
        +'</Remark>',

        <AddRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.1.0">
<RemarkInfo>
<Remark Type="General">
<Text>TEST GENERAL REMARK</Text>
</Remark>
</RemarkInfo>
</AddRemarkRQ> */

        getService(CommFoundHelper)
          .sendSWSRequest({
            action: "AddRemarkLLSRQ",
            payload: createRmk,
            authTokenType: "SESSION",
          })
          .then((res) => {
            this.setState({
              response: res.errorCode
                ? JSON.stringify(res, null, 2)
                : res.value,
            });
          });

        console.log("P¥ entry", pdocentry);
      }
    });

    var sendRmks = this.cfHelper.getXmlPayload("AddRemarkLLSRQ", {
      Remark: () => {
        let strRmk = "";

        for (let i = 0; i < 10; i++) {
          strRmk = strRmk.concat(
            this.cfHelper.getXmlPayload("Remark", {
              Text: "RMKRC" + i.toString(),
            })
          );
        }
        return strRmk;
      },
    });

    var sendAlphaRmks = this.cfHelper.getXmlPayload("AddRemarkLLSRQ", {
      Remark: () => {
        let strRmk = "";
        let myRemarks = [
          { Code: "A", Text: "My A Text" },
          { Code: "H", Text: "My H text" },
        ];

        for (let i = 0; i < myRemarks.length; i++) {
          strRmk = strRmk.concat(
            this.cfHelper.getXmlPayload("RemarkAlpha", {
              Code: myRemarks[i].Code,
              Text: myRemarks[i].Text,
            })
          );
        }
        return strRmk;
      },
    });

    console.log(sendRmks);

    // sendRmks = `<AddRemarkRQ xmlns="http://webservices.sabre.com/sabreXML/2011/10" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Version="2.1.0"><RemarkInfo><Remark Type="General"><Text>RMKRC0</Text></Remark><Remark Type="General"><Text>RMKRC1</Text></Remark><Remark Type="General"><Text>RMKRC2</Text></Remark><Remark Type="General"><Text>RMKRC3</Text></Remark><Remark Type="General"><Text>RMKRC4</Text></Remark><Remark Type="General"><Text>RMKRC5</Text></Remark><Remark Type="General"><Text>RMKRC6</Text></Remark><Remark Type="General"><Text>RMKRC7</Text></Remark><Remark Type="General"><Text>RMKRC8</Text></Remark><Remark Type="General"><Text>RMKRC9</Text></Remark></RemarkInfo></AddRemarkRQ>`;
    // console.log(sendRmks);

    getService(CommFoundHelper)
      .sendSWSRequest({
        action: "AddRemarkLLSRQ",
        payload: sendAlphaRmks,
        authTokenType: "SESSION",
      })
      .then((res) => {
        this.setState({
          response: res.errorCode ? JSON.stringify(res, null, 2) : res.value,
        });
      });
    console.log(this.state.response);
  };

  private displayP() {
    // btn on the screen allows the agent to get this sabre response on the screen
    let sabreStr: string = "*P¥*IA";
    getService(NativeSabreCommand).handleSubmit(sabreStr);
  }

  public getRemarks(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    // retrieve the reservation data (already called in componentDidMount)
    var reservation = commandMessageReservationRs["Data"];
    // retrieve all remarks from the pnr
    var remarks = reservation.Remarks.Remark;
    // keep only the ones beginning with p#
    const docRemarks: any = remarks.filter(function (i) {
      return i.Code === "P";
    });
    // create temp array
    let pvlines: any = [];
    // this is our regex to match to
    const re = /([A-Z]{2})\/NA-([A-Z]{2})\/P-([A-Z]{2,3})\/V-([A-Z]{2,4})\/PS-([A-Z]{2,7})\/VS-([A-Z]{2,7})\/PD-([A-Z]{2,3})\/EXP-([A-Z]{2,3})\/D-([A-Z]{1})/;
    // loop through all the p# remarks to see if they match the regex
    docRemarks.forEach((element) => {
      const match = re.exec(element.Text);

      if (match) {
        // these match
        console.log(element);
        console.log(
          `DE=${match[1]} NA=${match[2]} P=${match[3]} V=${match[4]} PS=${match[5]} VS=${match[6]} PD=${match[7]} EXP=${match[8]} D=${match[9]}`
        );

        //create proper object and append to the temp array

        let pvline = {
          Id: element.Id,
          Existing: true,
          CountryDestination: match[1],
          Citizenship: match[2],
          NeedPassport: match[3],
          NeedVisa: match[4],
          HavePassport: match[5],
          HaveVisa: match[6],
          PrimaryDocument: match[7],
          PassportExpSoon: match[8],
          DocumentType: match[9],
        };
        // add to the array
        pvlines.push(pvline);
      } else {
        console.log(`${element.Text} failed to meet regex pattern`);
      }
    });

    // add default line only if no existing lines ecist
    console.log(`Pvlines array has ${pvlines.length} rows `);

    if (pvlines.length === 0) {
      let defaultLine = {
        Id: 1000,
        Existing: false,
        CountryDestination: "",
        Citizenship: "",
        NeedPassport: "",
        NeedVisa: "",
        HavePassport: "",
        HaveVisa: "",
        PrimaryDocument: "",
        PassportExpSoon: "",
        DocumentType: "",
      };
      // add to array
      pvlines.push(defaultLine);
    }
    // set state to be whatever is in pvlines (our temp array)
    this.setState({
      PassportVisaDocList: pvlines,
    });
  }

  render(): JSX.Element {
    let errorMsg = this.state.errorMessage;
    let errorOutput;
    if (this.state.isError && errorMsg != "") {
      errorOutput = <Alert bsStyle="danger">{this.state.errorMessage}</Alert>;
    }
    return (
      <div className="tab-pane sas_passport_grid" id="passport">
        <div className="row">
          <div className="col-sm-1">
            <label>Citizenship</label>
          </div>
          <div className="col-sm-1">
            <label>Country Destination</label>
          </div>

          <div className="col-sm-1">
            <label>Need Passport?</label>
          </div>

          <div className="col-sm-1">
            <label>Need Visa?</label>
          </div>

          <div className="col-sm-1">
            <label>Have Passport?</label>
          </div>

          <div className="col-sm-1">
            <label>Have Visa?</label>
          </div>

          <div className="col-sm-1">
            <label>Primary document?</label>
          </div>

          <div className="col-sm-1">
            <label>Passport expire soon?</label>
          </div>

          <div className="col-sm-1">
            <label>Document type?</label>
          </div>
          <div className="col-sm-3">
            <label>Action</label>
          </div>
        </div>

        <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
          {this.state.PassportVisaDocList.map((s) => (
            <div className="row" key={s.Id}>
              <div className="col-sm-1">
                {/* <label>Citizenship</label> */}
                <input
                  type="text"
                  name="Citizenship"
                  className="form-control"
                  placeholder="ex. US"
                  onChange={this.handleChange(s.Id)}
                  value={s.Citizenship}
                />
              </div>
              <div className="col-sm-1">
                {/* <label>Country Destination</label> */}
                <input
                  type="text"
                  name="CountryDestination"
                  className="form-control"
                  placeholder="ex. DE"
                  onChange={this.handleChange(s.Id)}
                  value={s.CountryDestination}
                />
              </div>
              <div className="col-sm-1">
                {/* <label>Need Passport?>/label> */}
                <select
                  name="NeedPassport"
                  className="form-control"
                  value={s.NeedPassport}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div className="col-sm-1">
                {/* <label>Need Visa?</label> */}
                <select
                  name="NeedVisa"
                  className="form-control"
                  value={s.NeedVisa}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="UNK">Unknown</option>
                  <option value="ETA">ETA</option>
                  <option value="ESTA">ESTA</option>
                  <option value="COND">Conditional</option>
                </select>
              </div>

              <div className="col-sm-1">
                {/* <label>Have Passport?</label> */}
                <select
                  name="HavePassport"
                  className="form-control"
                  value={s.HavePassport}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="ADVSD">Advised</option>
                  <option value="PROCESS">Being Processed</option>
                  <option value="UNK">Unknown</option>
                </select>
              </div>
              <div className="col-sm-1">
                {/* <label>Have Visa?</label> */}
                <select
                  name="HaveVisa"
                  className="form-control"
                  value={s.HaveVisa}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                  <option value="ADVSD">Advised</option>
                  <option value="PROCESS">Being Processed</option>
                  <option value="WAIT">Delay reminder</option>
                  <option value="DIY">PAX do on own</option>
                  <option value="ARR">Upon arrival</option>
                </select>
              </div>
              <div className="col-sm-1">
                {/* <label>Primary document?</label> */}
                <select
                  name="PrimaryDocument"
                  className="form-control"
                  value={s.PrimaryDocument}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <div className="col-sm-1">
                {/* <label>Passport Expires Soon?</label> */}
                <select
                  name="PassportExpSoon"
                  className="form-control"
                  value={s.PassportExpSoon}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="YES">Yes</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <div className="col-sm-1">
                {/* <label>Document Type</label> */}
                <select
                  name="DocumentType"
                  className="form-control"
                  value={s.DocumentType}
                  onChange={this.handleChangeSelect(s.Id)}
                >
                  <option value="">Choose</option>
                  <option value="P">Passport</option>
                  <option value="I">National ID</option>
                </select>
              </div>
              <div className="col-sm-3">
                <i
                  className="fa fa-trash-alt"
                  onClick={this.handleDeleteDoc(s.Id)}
                />
              </div>
            </div>
          ))}
          {errorOutput}
          <div className="row">
            <div className="col-md-12">
              <Button className="btn" onClick={() => this.addDocument()}>
                {" "}
                Add Another Line
              </Button>

              <Button className="btn" onClick={() => this.displayP()}>
                *P¥*IA
              </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 sas-bottom-right">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>{" "}
            </div>
          </div>
        </form>
      </div>
    );
  }
}
