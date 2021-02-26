import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { SASHeaderTemplateContext } from "./SASHeaderTemplateContext";

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
  Citizenship: string;
  CountryDestination: string;
  NeedPassport: string;
  NeedVisa: string;
  HavePassport: string;
  HaveVisa: string;
  PrimaryDocument?: string;
  PassportExpSoon?: string;
  DocumentType?: string;
}
//create and defind var
export interface OwnState {
  lastPassVisaDocIndex: number;
  remarksList: any;
  premarksList: any;
  headerText: string;
  PassportVisaDocList: Array<PassportVisaItem>;
}

export class PassportVisaDoc extends React.Component<{}, OwnState> {
  constructor(props = {}) {
    super(props);
    this.state = {
      PassportVisaDocList: [
        {
          Id: 1000,
          Citizenship: "",
          CountryDestination: "",
          NeedPassport: "",
          NeedVisa: "",
          HavePassport: "",
          HaveVisa: "",
          PrimaryDocument: "",
          PassportExpSoon: "",
          DocumentType: "",
        },
      ],
      headerText: "Add Passport/Visa Documentation",
      lastPassVisaDocIndex: 1001,
      remarksList: [],
      premarksList: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.closePopovers = this.closePopovers.bind(this);
    this.getRemarks = this.getRemarks.bind(this);
  }

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
          Citizenship: lastitem.Citizenship,
          CountryDestination: "",
          NeedPassport: "",
          NeedVisa: "",
          HavePassport: lastitem.HavePassport,
          HaveVisa: "",
          PrimaryDocument: lastitem.PrimaryDocument,
          PassportExpSoon: lastitem.PassportExpSoon,
          DocumentType: lastitem.DocumentType,
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
      i.Id == id ? { ...i, [name]: value } : i
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
  };

  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("This is what happens when I click on the PassportVisa button");

    this.state.PassportVisaDocList.forEach((i) => {
      let citizenship = i.Citizenship.trim();
      let countrydestination = i.CountryDestination.trim();
      let havePassport = i.HavePassport;
      let haveVisa = i.HaveVisa;
      let needPassport = i.NeedPassport;
      let needVisa = i.NeedVisa;
      let passportExp = i.PassportExpSoon;
      let primaryDocument = i.PrimaryDocument;
      let documentType = i.DocumentType;

      let pdocentry: string =
        "5P¥" +
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

      console.log("P¥ entry", pdocentry);
    });
  };

  public getRemarks(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"];
    var remarks = reservation.Remarks.Remark;
    const docRemarks: any = remarks.filter(function (i) {
      return i.Code === "P";
    });

    let pvlines: any = [];

    const re = /([A-Z]{2})\/NA-([A-Z]{2})\/P-([A-Z]{2,3})\/V-([A-Z]{2,4})\/PS-([A-Z]{2,7})\/VS-([A-Z]{2,7})\/PD-([A-Z]{2,3})\/EXP-([A-Z]{2,3})\/D-([A-Z]{1})/;

    docRemarks.forEach((element) => {
      const match = re.exec(element.Text);

      if (match) {
        console.log(element);
        console.log(
          `DE=${match[1]} NA=${match[2]} P=${match[3]} V=${match[4]} PS=${match[5]} VS=${match[6]} PD=${match[7]} EXP=${match[8]} D=${match[9]}`
        );

        //create proper object and append to the temp array

        let pvline = {
          Id: element.Id,
          Citizenship: match[1],
          CountryDestination: match[2],
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
    // add default line regarless of whether there are existing comments
    let defaultLine = {
      Id: 1000,
      Citizenship: "",
      CountryDestination: "",
      NeedPassport: "",
      NeedVisa: "",
      HavePassport: "",
      HaveVisa: "",
      PrimaryDocument: "",
      PassportExpSoon: "",
      DocumentType: "",
    };

    pvlines.push(defaultLine);
    //console.log(pvlines);
    this.setState({
      PassportVisaDocList: pvlines,
    });
  }

  render(): JSX.Element {
    return (
      <div className="sas_passport_grid">
        <SASHeaderTemplateContext headertext={this.state.headerText} />
        <div className="PassVisaAdd">
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

            <div className="form-row">
              <div className="col-md-12">
                <Button onClick={() => this.addDocument()}>
                  {" "}
                  Add Documentation
                </Button>
              </div>
            </div>
            <div className="form-row">
              <div className="col-md-12">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
