import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { InputGroup } from "../../components/InputGroup";
import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { XmlTools } from "../../util/XmlTools";
import {
  Alert,
  Button as BtnBs,
  FormGroup,
  FormControl,
} from "react-bootstrap";
import { NativeSabreCommand } from "../../services/NativeSabreCommand";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";

export interface SOAPServicePopoverProps {
  handleClose?: () => void;
  navigation?: JSX.Element;
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

export interface SOAPServicePopoverState {
  actionCode: string;
  payload: string;
  response: any;
  rsfilter: string;
  shouldParse: boolean;
  lastPassVisaDocIndex: number;
  errorMessage: string;
  isError: boolean;
  PassportVisaDocList: Array<PassportVisaItem>;
}

export class PassportDocumentationPopover extends React.Component<
  SOAPServicePopoverProps,
  SOAPServicePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDuplicates = this.handleDuplicates.bind(this);
    this.handleDisplayP = this.handleDisplayP.bind(this);
    this.handleGetRemarks = this.handleGetRemarks.bind(this);
    this.handleSabreString = this.handleSabreString.bind(this);
  }

  state: SOAPServicePopoverState = {
    actionCode: "",
    payload: "",
    response: "",
    rsfilter: "",
    shouldParse: false,
    PassportVisaDocList: [],
    lastPassVisaDocIndex: 1001,
    errorMessage: "",
    isError: false,
  };

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  componentDidMount(): void {
    console.log("Searching for P¥ ....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise.then(this.handleGetRemarks).catch((error) => {
      console.log("Error while receiving reservation");
      console.log(error);
    });
  }

  handleChange = (id: number) => (e): void => {
    const doc = this.state.PassportVisaDocList.map((i) =>
      i.Id == id
        ? {
            ...i,
            [e.target.name]: e.target.value.toUpperCase().trim(),
            isChange: true,
          }
        : i
    );

    this.setState({
      PassportVisaDocList: doc,
    });
  };

  handleDelete = (id: number) => (e): void => {
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
    let isError = this.handleDuplicates();

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

  getValidationState(): any {
    return "success";
  }

  handleAdd(e): void {
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

  handleDuplicates = async () => {
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
      console.log(` STOP: Multiple entries ${duplicates}`);
      let msg: string = ` You can't enter the same country multiple times (${duplicates})`;
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

  handleDisplayP(): void {
    // btn on the screen allows the agent to get this sabre response on the screen
    let sabreStr: string = "*P¥*IA";
    getService(NativeSabreCommand).handleSubmit(sabreStr);
  }

  handleSabreString(obj) {
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

  handleGetRemarks(
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
          console.log(this.handleSabreString(pvline));

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

  handleExecute(e): void {
    e.preventDefault();
    console.log("will execute");

    let tempList: any = this.state.PassportVisaDocList.map((i) => ({
      ...i,
      Type: "Alpha-Coded",
      Code: "P",
      Text: this.handleSabreString(i),
    }));

    console.log(`${tempList}`);

    var remarksFail = this.cfHelper.handleRemarkChanges(tempList);
    console.log(`Now close the window ${remarksFail}`);
    this.props.handleClose();
    this.cfHelper.refreshTripSummary();
    this.cfHelper.displayGraphicalPnr();
  }
  handleExecute2 = async (e): Promise<void> => {
    e.preventDefault();
    console.log("will execute");

    const tempList: Array<any> = [...this.state.PassportVisaDocList];
    let sendRmks: any = this.state.PassportVisaDocList;
    // loop through and get correct text value...

    console.log(tempList);
    console.log(sendRmks);

    // now decide what to do ...
    // any duplicates?
    var isError = await this.handleDuplicates();
    console.log(isError);

    if (isError === true) {
      console.log(` **** STOP ***** `);
    } else {
      console.log(` **** OK ***** `);

      //now break up the entries into new ones and modify ones...
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
                  Text: this.handleSabreString(newentries[i]),
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
            getService(CommFoundHelper).refreshTripSummary();

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

            this.props.handleClose();
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
                  Text: this.handleSabreString(modifyentries[i]),
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
            getService(CommFoundHelper).refreshTripSummary();
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
            this.props.handleClose();
          });
      }
    }
  };

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="*P¥*IA"
        handleClick={this.handleDisplayP}
      />,
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
    let errorMsg = this.state.errorMessage;
    let errorOutput;
    if (this.state.isError && errorMsg != "") {
      errorOutput = (
        <Alert bsStyle="danger">
          <i className="fa fa-exclamation-triangle"></i>
          {this.state.errorMessage}
        </Alert>
      );
    }
    return (
      <PopoverFormSAS
        name=""
        title="Passport &amp; Visa Documentation"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <div className="sas-main-popover-passport-documentation">
          <form noValidate onSubmit={this.handleExecute} autoComplete="off">
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
                      {/* <input
                        type="text"
                        name="Citizenship"
                        className="form-control"
                        onChange={this.handleChange(s.Id)}
                        value={s.Citizenship}
                      /> */}

                      <FormControl
                        type="text"
                        name="Citizenship"
                        value={s.Citizenship}
                        onChange={this.handleChange(s.Id)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="CountryDestination"
                        className="form-control"
                        onChange={this.handleChange(s.Id)}
                        onMouseOut={this.handleDuplicates}
                        value={s.CountryDestination}
                      />
                    </td>
                    <td>
                      <select
                        name="NeedPassport"
                        className="form-control"
                        value={s.NeedPassport}
                        onChange={this.handleChange(s.Id)}
                      >
                        <option value="">Choose</option>
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="NeedVisa"
                        className="form-control"
                        value={s.NeedVisa}
                        onChange={this.handleChange(s.Id)}
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
                      <select
                        name="HavePassport"
                        className="form-control"
                        value={s.HavePassport}
                        onChange={this.handleChange(s.Id)}
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
                      <select
                        name="HaveVisa"
                        className="form-control"
                        value={s.HaveVisa}
                        onChange={this.handleChange(s.Id)}
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
                      <select
                        name="PrimaryDocument"
                        className="form-control"
                        value={s.PrimaryDocument}
                        onChange={this.handleChange(s.Id)}
                      >
                        <option value="">Choose</option>
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </td>

                    <td>
                      <select
                        name="PassportExpSoon"
                        className="form-control"
                        value={s.PassportExpSoon}
                        onChange={this.handleChange(s.Id)}
                      >
                        <option value="">Choose</option>
                        <option value="YES">Yes</option>
                        <option value="NO">No</option>
                      </select>
                    </td>

                    <td>
                      <select
                        name="DocumentType"
                        className="form-control"
                        value={s.DocumentType}
                        onChange={this.handleChange(s.Id)}
                      >
                        <option value="">Choose</option>
                        <option value="P">Passport</option>
                        <option value="I">National ID</option>
                      </select>
                    </td>
                    <td>
                      <i
                        className="fa fa-trash-alt"
                        onClick={this.handleDelete(s.Id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {errorOutput}
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
