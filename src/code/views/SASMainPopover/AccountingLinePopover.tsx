import * as React from "react";
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
} from "react-bootstrap";

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
  LastNameFirstInitial: string;
  BaseFare: number;
  Tax: number;
  Commission: number;
  FareApplication: string;
  NumberOfConjunctedDocuments: string;
  TariffBasis: string;
  FreeFormText?: string;
  isChange: boolean;
  isExisting: boolean;
}

export interface TemplatePopoverState {
  // your state variables
  actionCode: string;
  payload: string;
  response: any;
  rsfilter: string;
  shouldParse: boolean;
  AccountingLineList: Array<AcctingLine>;
  acindex: number;
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
  };

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  componentDidMount(): void {
    console.log(`Accounting Popover Loading`);
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
        console.log(res);
        let thexml = res.value;
        const parser = new DOMParser();
        const xml = parser.parseFromString(thexml, "application/xml");
        let aclines: any = xml.getElementsByTagName("stl19:AccountingLines")[0]
          .childNodes;
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
      });
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

  handleCheck(e): void {
    // this handles someone clicked on the checkbox
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }

  handleDelete = (id: number) => (e): void => {
    console.log(`I clicked on delete`);
    let doclist = this.state.AccountingLineList;
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
      AccountingLineList: doclist,
    });

    if (isExisting === true) {
      // need to remove from sabre too
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
          LastNameFirstInitial: "",
          BaseFare: 0,
          Tax: 0,
          Commission: 0,
          FareApplication: "",
          NumberOfConjunctedDocuments: "",
          TariffBasis: "",
          FreeFormText: "",
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
    // AddAccountingLineLLSRQ
    // https://developer.sabre.com/docs/soap_apis/management/itinerary/Add_Accounting_Line
    //files.developer.sabre.com/drc/servicedoc/AddAccountingLineLLSRQ_v2.0.0_Sample_Payloads.xml

    //console.log(`Now close the window`);
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
                    </td>
                    <td>
                      <FormControl
                        type="text"
                        name="LastNameFirstInitial"
                        placeholder="LastName FirstInitial"
                        value={s.LastNameFirstInitial}
                        onChange={this.handleChange(s.Id)}
                      />
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
                        onClick={this.handleDelete(s.Id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
