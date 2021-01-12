import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import { getService, context } from "../Context";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";
import {
  Modal,
  Alert,
  Panel,
  Badge,
  Grid,
  Row,
  Col,
  Clearfix,
  Button,
  OverlayTrigger,
  Popover,
  ListGroup,
  ListGroupItem,
  Tooltip,
} from "react-bootstrap";
import * as moment from "moment";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { SASUtils } from "../services/SASUtils";

const eventBus: AbstractModel = new AbstractModel();

export interface MyProps {
  closePopovers: () => void;
}

export interface MyState {
  show: boolean;
  ipRoomType: string;
  ipCurrency: string;
  ipAmount: number;
  ipCheckIn: string;
  ipCheckOut: string;
  ipNights: number;
  ipRoomCount: number;
  ipConfirmationNumber: any;
  ipCancelPolicy: string;
  ipHotelComm: string;
  hotelList: any;
  remarksList: any;
  sarsList: any;
  selectedHotelId: number;
  thisHotel: any;
  addNewSar: boolean;
  xk: boolean;
  lastSarIndex: number;
}

export class SASHotelHKtoGK extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.closePopovers = this.closePopovers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeSAR = this.handleChangeSAR.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayHotelSegment = this.displayHotelSegment.bind(this);
    this.getSarRemarks = this.getSarRemarks.bind(this);
    this.addSar = this.addSar.bind(this);
    this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
    this.updateCheckboxes = this.updateCheckboxes.bind(this);
    this.state = {
      show: false,
      ipRoomType: "ROH",
      ipCurrency: "USD",
      ipAmount: null,
      ipNights: 1,
      ipCheckIn: "",
      ipCheckOut: "",
      ipRoomCount: 1,
      ipConfirmationNumber: "",
      ipCancelPolicy: "1D",
      ipHotelComm: "CMN-NC",
      hotelList: [],
      remarksList: [],
      sarsList: [],
      selectedHotelId: null,
      thisHotel: {},
      addNewSar: false,
      xk: true,
      lastSarIndex: 1000,
    };
  }

  // getting pnr
  componentDidMount() {
    console.log("Getting PNR Info....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise
      .then(this.displayHotelSegment.bind(this))
      .catch((error) => {
        console.log("Error while receiving reservation");
        console.log(error);
      });
  }

  // getting only hotel segments from all the segments
  public displayHotelSegment(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"];
    console.log(reservation);
    var hotels = reservation.Segments.HotelSegments.Hotel;
    this.setState({
      hotelList: hotels,
    });
    var remarks = reservation.Remarks.Remark;
    this.setState({
      remarksList: remarks,
    });
    console.log(`${hotels.length} hotels in PNR`);
    if (this.state.hotelList.length === 1) {
      // pre-populate the form

      console.log(
        `we need to pre-populate the form as there is only 1 hotel ${this.state.hotelList[0].HotelInformation.Name}`
      );

      this.prepopulateTheForm(hotels[0]);
    } else {
      // they must choose a hotel first
      console.log(`user must choose the hotel`);
    }
  }

  // handle change of value for input fields including dates
  // also includes function for handling check out/duration changes
  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    // these are the various checks on changes to the input fields
    if (name === "ipNights") {
      // set the check out when they change the nights
      let newCheckOut = moment(this.state.ipCheckIn)
        .add(value, "d")
        .format("YYYY-MM-DD");

      this.setState({
        ipCheckOut: newCheckOut,
      });
    } else if (name === "ipCheckOut") {
      // set the nights when they change the check out
      let dChkIn = moment(this.state.ipCheckIn);
      let dChkOut = moment(value);
      let diff = dChkOut.diff(dChkIn, "days");

      this.setState({
        ipNights: diff,
      });
    }
    // do this for all
    this.setState({
      [name]: value,
    });
  };

  public handleChangeSAR = (id: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name: any = e.target.name;
    let value: any;
    if (name === "Keep") {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }
    console.log(`${value}, ${name}, ${id}`);
    const newSar = this.state.sarsList.map((i) =>
      i.Id == id ? { ...i, [name]: value } : i
    );

    this.setState({
      sarsList: newSar,
    });
  };

  public updateCheckboxes = (isChecked: boolean) => (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    const newSar = this.state.sarsList.map((i) =>
      i.Keep !== isChecked ? { ...i, Keep: isChecked } : i
    );

    this.setState({
      sarsList: newSar,
    });
  };

  private handleChangeCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked: boolean = event.currentTarget.checked;
    const name: any = event.currentTarget.name;
    this.setState({
      [name]: checked,
    });
  };

  // changes a number field to 2 decimal places
  public handleBlur = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name: any = event.currentTarget.name;
    let value: any = event.currentTarget.value;
    let tempvalue = parseInt(value).toFixed(2);
    this.setState({
      [name]: tempvalue,
    });
  };

  // this is called when the user has to choose a hotel when there are multiple in the pnr and they have chosen one
  // it finds all the info for the selected hotel
  public getThisHotel(e) {
    // get this hotel
    const value: any = parseInt(e.target.value);
    console.log(
      `OK, let's prepopulate the form with hotelid=${value} was ${this.state.selectedHotelId}`
    );
    const foundHotel = this.state.hotelList.find((h) => h.Id === value);
    //var hotels = reservation.Segments.HotelSegments.Hotel;
    console.log(foundHotel);

    if (foundHotel !== undefined) {
      this.prepopulateTheForm(foundHotel);
    } else {
      // blank out the form
      this.setState({
        show: false,
        ipRoomType: "ROH",
        ipCurrency: "USD",
        ipAmount: null,
        ipNights: 1,
        ipCheckIn: "",
        ipCheckOut: "",
        ipRoomCount: 1,
        ipConfirmationNumber: "",
        ipCancelPolicy: "1D",
        ipHotelComm: "CMN-NC",
      });
    }
  }

  // this is called when a hotel is found so the form can be prepopulated
  public prepopulateTheForm(hotel) {
    // a hotel = the parameter is a single hotel object
    console.log(
      `this is the hotel object ${
        hotel.HotelInformation.Name
      } start pre-populating ${typeof hotel}`
    );

    const thisHotel = hotel;
    console.log(thisHotel);
    let amt: any = parseInt(
      thisHotel.ReservationDetails.Rates.NightlyRate.Amount
    ).toFixed(2);
    this.setState({
      thisHotel: hotel,
      ipCheckIn: thisHotel.ReservationDetails.CheckIn.substring(0, 10),
      ipCheckOut: thisHotel.ReservationDetails.CheckOut.substring(0, 10),
      ipRoomType: thisHotel.ReservationDetails.RoomTypeCode,
      ipCurrency: thisHotel.ReservationDetails.Rates.NightlyRate.Currency,
      ipAmount: amt,
      ipRoomCount: thisHotel.ReservationDetails.NumberOfUnits,
      ipConfirmationNumber: thisHotel.ReservationDetails.Confirmation,
      ipCancelPolicy:
        thisHotel.ReservationDetails.CancellationPolicy.PolicyCode,
      ipHotelComm: "CMN-NC",
      ipNights: thisHotel.ReservationDetails.Duration,
    });
    console.log(`end of prepoulation for  ${hotel.HotelInformation.Name} `);
    // gets sars for this hotel
    this.getSarRemarks(thisHotel.Id);
  }

  // handles setting the value for select/dropdown lists
  handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    this.setState({
      [name]: value,
    });
  };

  // get sars for this segment
  public getSarRemarks(id) {
    console.log(`searching for id=${id} in ${this.state.remarksList}`);
    const sars: any = this.state.remarksList.filter(function (i) {
      return i.SegmentAssociation && i.SegmentAssociation.SegmentIds == id;
    });

    // const sars2 = sars.map((item) => {
    //   return {
    //     ...item,
    //     keep: true,
    //   };
    // });

    const sars3 = sars.map(({ Id, Text }) => ({
      Id,
      Text,
      Keep: true,
    }));

    //console.log(sars3);

    if (sars3.length > 0) {
      //do what
      console.log(sars3);
      this.setState({
        sarsList: sars3,
      });
    }
  }

  public addSar() {
    let next = this.state.lastSarIndex;
    this.setState((prevState) => ({
      sarsList: [
        ...prevState.sarsList,
        {
          Id: next + 1,
          Text: "",
          Keep: true,
        },
      ],
    }));
    this.setState({
      lastSarIndex: next + 1,
    });
  }

  // handle submit
  public handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`I clicked submit ${event}`);
    // form the GK entry
    //       0HHTAAGK1DFWIN27JUL-OUT2AUG/HI AIRPORT WEST/SGLB/75.00/SI-@5827 OCEAN DRIVE¥MIAMI FL 38834¥PHONE305-555-1111@RQNEAR POOL/CF89732901
    // /3/   0HHTMCGK1DENIN17JUL-OUT18JUL/MC MARRIOTT DEN AIRPORT GATEWAY/REGA00/229.00USD/G/CMN-NC/SI-¤16455 E 40TH CIRCLE¥AURORA CO 80011¥FONE 303-371-4333¤C-01D*44985/CF-84102904-
    // take date in the format YYYY-MM-DD and returns DDMMM 2021-01-15 to 15JAN
    let newCheckIn: string = SASUtils.convertDate(this.state.ipCheckIn);
    let newCheckOut: string = SASUtils.convertDate(this.state.ipCheckOut);
    let newSegNumber: number = this.state.thisHotel.OrderNumber + 1;
    let sellentry: string =
      "/" +
      newSegNumber +
      "/" +
      "0HHT" +
      this.state.thisHotel.HotelInformation.ChainCode +
      "GK" +
      this.state.ipRoomCount +
      this.state.thisHotel.HotelInformation.Address.CityCode +
      "IN" +
      newCheckIn +
      "-OUT" +
      newCheckOut +
      "/" +
      this.state.thisHotel.HotelInformation.ChainCode +
      " " +
      this.state.thisHotel.HotelInformation.Name +
      "/" +
      this.state.ipRoomType +
      "/" +
      this.state.ipAmount +
      this.state.ipCurrency +
      "/G/" +
      this.state.ipHotelComm +
      "/SI-¤" +
      this.state.thisHotel.HotelInformation.Address.AddressLine[0] +
      "¥" +
      this.state.thisHotel.HotelInformation.Address.AddressLine[1] +
      "¥" +
      "FONE " +
      this.state.thisHotel.HotelInformation.PhoneNumber +
      "¤C-" +
      this.state.ipCancelPolicy +
      "*" +
      this.state.thisHotel.HotelInformation.SabreCode +
      "/CF-" +
      this.state.ipConfirmationNumber;

    console.log(sellentry);

    getService(NativeSabreCommand).handleSubmit(sellentry);

    // if that was successful - how can we know that?

    // do we need to redisplay the form

    // do we have any SAR's to
    const sarList = this.state.sarsList;

    getService(NativeSabreCommand).handleSubmit("*A");

    sarList.forEach((i) => {
      if (i.Keep === true && i.Text != "") {
        let sarEntry = `5¥S${newSegNumber} ${i.Text}`;
        getService(NativeSabreCommand).handleSubmit(sarEntry);
      }
    });

    // if successful now XK the segment if they want it XK'd

    if (this.state.xk === true) {
      let xkEntry = `.${this.state.thisHotel.OrderNumber}XK`;
      getService(NativeSabreCommand).handleSubmit(xkEntry);
    }
  };

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  // form validation
  // if the country = US then currency must be USD else warning
  // if foreign currency check the rate to make sure between $50 and $1000
  // do we want typeahead for room type?
  // do we need dropdown for cancel policy
  // must have values everywhere

  render(): JSX.Element {
    const howmany: number = this.state.hotelList.length;
    const sarsCount: number = this.state.sarsList.length;
    let dropdownList;
    //   this isn't working....
    if (howmany > 1) {
      dropdownList = <option value="">Select a hotel please.....</option>;
    }

    return (
      <div className="tab-pane" id="hotelscript">
        <p>Convert HK to Passive Segment</p>

        <form id="FormHkToYk" onSubmit={this.handleSubmit} ref="form">
          <div className="form-row">
            <div className="form-group col-md-11">
              <label htmlFor="hotelList">Hotel List ({howmany})</label>
              <select
                className="form-control"
                name="hotelList"
                onChange={this.getThisHotel.bind(this)}
              >
                {dropdownList}
                {this.state.hotelList.map((h) => (
                  <option key={h.Id} value={h.Id}>
                    {h.Id}- {h.HotelInformation.Name} -{" "}
                    {h.ReservationDetails.CheckIn}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-md-1">
              <label htmlFor="xk">XK Seg</label>
              <input
                type="checkbox"
                name="xk"
                checked={this.state.xk}
                onChange={this.handleChangeCheckbox}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="ipCheckIn" className="form-label">
                Check in
              </label>
              <input
                type="date"
                className="form-control text-uppercase"
                name="ipCheckIn"
                value={this.state.ipCheckIn}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="ipNights">Nights</label>
              <input
                type="text"
                className="form-control"
                name="ipNights"
                placeholder="Nights"
                value={this.state.ipNights}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="ipCheckOut">Check out</label>
              <input
                type="date"
                className="form-control text-uppercase"
                name="ipCheckOut"
                value={this.state.ipCheckOut}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="ipRoomCount">Number of rooms</label>
              <input
                type="text"
                className="form-control"
                name="ipRoomCount"
                placeholder="1"
                value={this.state.ipRoomCount}
                onChange={this.handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="ipRoomType">Room type</label>
              <input
                type="text"
                className="form-control text-uppercase"
                value={this.state.ipRoomType}
                name="ipRoomType"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipCurrency">Currency</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="ipCurrency"
                value={this.state.ipCurrency}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipAmount">Amount</label>
              <input
                type="number"
                className="form-control noarrows"
                name="ipAmount"
                placeholder="Nightly Rate ##.##"
                value={this.state.ipAmount}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="ipConfirmationNumber">Confirmation number</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="ipConfirmationNumber"
                value={this.state.ipConfirmationNumber}
                placeholder="CF#"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipCancelPolicy">Cancellation Policy</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="ipCancelPolicy"
                value={this.state.ipCancelPolicy}
                placeholder="6P"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipHotelComm">Commissionable</label>
              <select
                className="form-control"
                name="ipHotelComm"
                value={this.state.ipHotelComm}
                onChange={this.handleChangeSelect}
              >
                <option value="CMN-C">Yes</option>
                <option value="CMN-NC">No</option>
              </select>
            </div>
          </div>
          <div className="sars">
            <Row className="border-bottom border-gray pb-2 mb-0">
              <h6>Sars</h6>
              {sarsCount > 0 && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary mr-2"
                    onClick={this.updateCheckboxes(true)}
                  >
                    Check All
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary mr-2"
                    onClick={this.updateCheckboxes(false)}
                  >
                    Uncheck All
                  </button>
                </>
              )}
            </Row>
            {this.state.sarsList.map((s) => (
              <div key={s.Id} className="form-row">
                <div className="form-group col-md-1">
                  <input
                    type="checkbox"
                    name="Keep"
                    checked={s.Keep}
                    onChange={this.handleChangeSAR(s.Id)}
                  />
                </div>

                <div className="form-group col-md-11">
                  <input
                    name="Text"
                    placeholder="Text Remark"
                    type="text"
                    className="form-control"
                    value={s.Text}
                    onChange={this.handleChangeSAR(s.Id)}
                  />
                </div>
              </div>
            ))}

            <Button onClick={() => this.addSar()}>Add Another SAR</Button>
          </div>
          <div className="form-row">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  }
}
