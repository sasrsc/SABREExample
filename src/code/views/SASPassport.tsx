import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
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

export class PassportVisaItem {
  Id: number;
  isExisting: boolean;
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
  deleteList: any;
  response: any;
  PassportVisaDocList: Array<PassportVisaItem>;
}

export class SASPassport extends React.Component<{}, OwnState> {
  constructor(props = {}) {
    super(props);
    this.state = {
      PassportVisaDocList: [],
      headerText: "Add Passport/Visa Documentation",
      lastPassVisaDocIndex: 1001,
      remarksList: [],
      premarksList: [],
      deleteList: [],
      errorMessage: "",
      response: "",
      isError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkMultipleCountries = this.checkMultipleCountries.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.closePopovers = this.closePopovers.bind(this);
    this.getRemarks = this.getRemarks.bind(this);
  }

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  // this is called when the component first loads
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

  // this is used to format the sabre string entry as we need it
  public getSabreString(obj) {
    return (
      obj.CountryDestination +
      "/NA-" +
      obj.Citizenship +
      "/P-" +
      obj.NeedPassport +
      "/V-" +
      obj.NeedVisa +
      "/PS-" +
      obj.HavePassport +
      "/VS-" +
      obj.HaveVisa +
      "/PD-" +
      obj.PrimaryDocument +
      "/EXP-" +
      obj.PassportExpSoon +
      "/D-" +
      obj.DocumentType
    );
  }

  // close the popover
  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  // when they click to add another item into the array
  private addDocument() {
    let lastitem: any;
    if (this.state.PassportVisaDocList.length > 0) {
      lastitem = this.state.PassportVisaDocList[
        this.state.PassportVisaDocList.length - 1
      ];
    } else {
      lastitem = {
        Citizenship: "",
        HavePassport: "",
        PrimaryDocument: "",
        PassportExpSoon: "",
        DocumentType: "",
      };
    }
    let next = this.state.lastPassVisaDocIndex;
    //get the values from the last item in the array to pre populate the new item

    //add another row to our array
    this.setState((prevState) => ({
      PassportVisaDocList: [
        ...prevState.PassportVisaDocList,
        {
          Id: next + 1,
          isExisting: false,
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

  // when they change the text fields
  private handleChange = (id: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value.toUpperCase();
    //console.log(`${name} has changed to ${value}`);

    const doc = this.state.PassportVisaDocList.map((i) =>
      i.Id == id ? { ...i, [name]: value, isChange: true } : i
    );

    this.setState({
      PassportVisaDocList: doc,
    });
  };

  // when they change the select fields
  private handleChangeSelect = (id: number) => (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    //console.log(`Changing ${name} to ${value}`);
    const doc = this.state.PassportVisaDocList.map((i) =>
      i.Id == id ? { ...i, [name]: value, isChange: true } : i
    );

    this.setState({
      PassportVisaDocList: doc,
    });
  };

  // when they want to delete an item in the array
  private handleDeleteDoc = (id: number) => (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    let doclist = this.state.PassportVisaDocList;
    console.log(`**** Delete line ${id} ****`);
    let itemtodelete: number = null;
    let isExisting: boolean;
    doclist.forEach((i, index) => {
      if (i.Id == id) {
        itemtodelete = index;
        isExisting = i.isExisting;
      }
    });
    // remove from our temp list
    doclist.splice(itemtodelete, 1);

    // update state to reflect the item being removed
    this.setState({
      PassportVisaDocList: doclist,
    });

    // are there still duplicate countries?
    let isError = this.checkMultipleCountries();

    console.log(`Existing row(${id})? = ${isExisting}`);

    if (isExisting === true) {
      // create xml to delete the item from the face of the pnr if it was in there in the beginning ...
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
    }
  };

  // when they delete a row or submit we will call this utility function to make sure there are no duplicate country lines
  public checkMultipleCountries = async () => {
    const localcopy = this.state.PassportVisaDocList;
    let duplicates = "";
    let isError: boolean = false;
    console.log(`***searching for duplicates****`);

    this.state.PassportVisaDocList.forEach((i) => {
      /* loop through all the items in the existing list....
         how many times does the same destination exist already? it should appear only once "as itself"
      */
      // temp var to store the country we are searching for...
      let countrydestination = i.CountryDestination.trim();
      // search the array to see how many times it exists
      const sameDestination: any = localcopy.filter(function (i) {
        return i.CountryDestination === countrydestination;
      });
      console.log(
        `${sameDestination.length} entries found for ${countrydestination}`
      );
      // if it appears more than once (itself) then alert
      if (sameDestination.length > 1) {
        duplicates = duplicates.concat(", ", countrydestination);
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
  };

  // they click on submit
  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("***Submit PassportVisa Form***");
    const tempList: Array<any> = [...this.state.PassportVisaDocList];
    let sendRmks: any = [];
    // now decide what to do ...
    // any duplicates?
    var isError = await this.checkMultipleCountries();
    console.log(isError);

    if (isError === true) {
      console.log(` **** STOP ***** `);
    } else {
      console.log(` **** OK ***** `);
      // now break up the entries into new ones and modify ones...
      const newentries: any = tempList.filter(function (i) {
        return i.isExisting === false;
      });
      if (newentries.length > 0) {
        console.log(`There are ${newentries.length} that must be added`);
        sendRmks = this.cfHelper.getXmlPayload("AddRemarkLLSRQ", {
          Remark: () => {
            let strRmk = "";
            for (let i = 0; i < newentries.length; i++) {
              strRmk = strRmk.concat(
                this.cfHelper.getXmlPayload("RemarkAlpha", {
                  Code: "P",
                  Text: this.getSabreString(newentries[i]),
                })
              );
            }
            return strRmk;
          },
        });
        console.log(sendRmks);

        getService(CommFoundHelper)
          .sendSWSRequest({
            action: "AddRemarkLLSRQ",
            payload: sendRmks,
            authTokenType: "SESSION",
          })
          .then((res) => {
            this.setState({
              response: res.errorCode
                ? JSON.stringify(res, null, 2)
                : res.value,
            });
            getService(CommFoundHelper).refreshTipSummary();

            if (res.errorCode !== undefined && res.errorCode !== null) {
              getService(IAreaService).showBanner(
                "Error",
                "Failed: ".concat(res.errorCode),
                "Passport & Visa Documentation"
              );
            } else {
              getService(IAreaService).showBanner(
                "Success",
                "Added",
                "Passport & Visa Documentation"
              );
            }

            this.closePopovers();
          });
      }
      const modifyentries: any = tempList.filter(function (i) {
        return i.isExisting === true && i.isChange === true;
      });
      if (modifyentries.length > 0) {
        console.log(`There are ${modifyentries.length} that must be modified`);

        sendRmks = this.cfHelper.getXmlPayload("ModifyRemarkLLSRQ", {
          Remark: () => {
            let strRmk = "";
            for (let i = 0; i < modifyentries.length; i++) {
              strRmk = strRmk.concat(
                this.cfHelper.getXmlPayload("RemarkModify", {
                  LineNumber: '"' + modifyentries[i].Id + '"',
                  Code: "P",
                  Text: this.getSabreString(modifyentries[i]),
                })
              );
            }
            return strRmk;
          },
        });
        console.log(sendRmks);

        getService(CommFoundHelper)
          .sendSWSRequest({
            action: "ModifyRemarkLLSRQ",
            payload: sendRmks,
            authTokenType: "SESSION",
          })
          .then((res) => {
            this.setState({
              response: res.errorCode
                ? JSON.stringify(res, null, 2)
                : res.value,
            });
            getService(CommFoundHelper).refreshTipSummary();
            if (res.errorCode !== undefined && res.errorCode !== null) {
              getService(IAreaService).showBanner(
                "Error",
                "Failed: ".concat(res.errorCode),
                "Passport & Visa Documentation"
              );
            } else {
              getService(IAreaService).showBanner(
                "Success",
                "Modified",
                "Passport & Visa Documentation"
              );
            }
            this.closePopovers();
          });
      }
    }
  };

  // this is a native sabre call used primarily while testing
  private displayP() {
    // btn on the screen allows the agent to get this sabre response on the screen
    let sabreStr: string = "*P¥*IA";
    getService(NativeSabreCommand).handleSubmit(sabreStr);
  }

  // called from the componentdidmount function to get all the P# remarks in the pnr
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
        let pvline = new PassportVisaItem();
        (pvline.CountryDestination = match[1]),
          (pvline.Citizenship = match[2]),
          (pvline.NeedPassport = match[3]),
          (pvline.NeedVisa = match[4]),
          (pvline.HavePassport = match[5]),
          (pvline.HaveVisa = match[6]),
          (pvline.PrimaryDocument = match[7]),
          (pvline.PassportExpSoon = match[8]),
          (pvline.DocumentType = match[9]),
          (pvline.Id = element.Id),
          (pvline.isExisting = true),
          (pvline.isChange = false),
          console.log(this.getSabreString(pvline));

        // add to the array
        pvlines.push(pvline);
      } else {
        console.log(`${element.Text} failed to meet regex pattern`);
      }
    });

    // add default line only if no existing lines ecist
    console.log(`Pvlines array has ${pvlines.length} rows `);

    if (pvlines.length === 0) {
      let blankline = new PassportVisaItem();

      (blankline.Id = 1000),
        (blankline.isExisting = false),
        (blankline.CountryDestination = ""),
        (blankline.Citizenship = ""),
        (blankline.NeedPassport = ""),
        (blankline.NeedVisa = ""),
        (blankline.HavePassport = ""),
        (blankline.HaveVisa = ""),
        (blankline.PrimaryDocument = ""),
        (blankline.PassportExpSoon = ""),
        (blankline.DocumentType = ""),
        (blankline.isChange = false);
      // add to array
      pvlines.push(blankline);
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
        <form onSubmit={this.handleSubmit.bind(this)} autoComplete="off">
          <table className="table">
            <thead>
              <tr>
                <th>Citizenship</th>
                <th>Destination</th>
                <th>Need Passport</th>
                <th>Need Visa</th>
                <th>Have Passport</th>
                <th>Have Visa</th>
                <th>Primary Doc</th>
                <th>Expires</th>
                <th>Doc Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.state.PassportVisaDocList.map((s) => (
                <tr key={s.Id}>
                  <td>
                    {/* {s.Id} */}
                    {/* <label>Citizenship</label> */}
                    <input
                      type="text"
                      name="Citizenship"
                      className="form-control"
                      onChange={this.handleChange(s.Id)}
                      value={s.Citizenship}
                    />
                  </td>
                  <td>
                    {/* <label>Country Destination</label> */}
                    <input
                      type="text"
                      name="CountryDestination"
                      className="form-control"
                      onChange={this.handleChange(s.Id)}
                      value={s.CountryDestination}
                    />
                  </td>
                  <td>
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
                  </td>
                  <td>
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
                  </td>

                  <td>
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
                      <option value="PROCESS">In Process</option>
                      <option value="UNK">Unknown</option>
                    </select>
                  </td>
                  <td>
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
                      <option value="PROCESS">In Process</option>
                      <option value="WAIT">Delay reminder</option>
                      <option value="DIY">PAX DIY</option>
                      <option value="ARR">Upon arrival</option>
                    </select>
                  </td>
                  <td>
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
                  </td>

                  <td>
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
                  </td>

                  <td>
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
                  </td>
                  <td>
                    <i
                      className="fa fa-trash-alt"
                      onClick={this.handleDeleteDoc(s.Id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
