import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { InputGroup } from "../../components/InputGroup";
import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { XmlTools } from "../../util/XmlTools";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import {
  Modal,
  Alert,
  Panel,
  Badge,
  Grid,
  Row,
  Col,
  Clearfix,
  Button as BtnBs,
  OverlayTrigger,
  Popover,
  ListGroup,
  ListGroupItem,
  Tooltip,
} from "react-bootstrap";
import * as moment from "moment";

import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";
import { isNull } from "underscore";

export interface SOAPServicePopoverProps {
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export class PassiveHotelSegment {
  chainCode: string;
  xk: boolean;
  id: number;
  segment?: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  roomCount: number;
  confirmationNumber: string;
  cancelPolicy: string;
  commission: string;
  roomType: string;
  currency: string;
  roomRate: string;
  cityCode: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  sabreCode: string;
  comments: string;
}

export interface SOAPServicePopoverState {
  actionCode: string;
  payload: string;
  response: any;
  rsfilter: string;
  shouldParse: boolean;
  show: boolean;
  hotelList: any;
  remarksList: any;
  sarsList: any;
  selectedHotelId: number;
  thisHotel: PassiveHotelSegment;
  addNewSar: boolean;
  xk: boolean;
  lastSarIndex: number;
}

//  chainCode: string;
//   propertyName: string;
//   checkIn: string;
//   checkOut: string;
//   nights: number;
//   roomCount: number;
//   confirmationNumber: string;
//   cancelPolicy: string;
//   commission: string;
//   roomType: string;
//   currency: string;
//   roomRate: number;
//   cityCode: string;
//   address1: string;
//   address2: string;
//   city: string;
//   state: string;
//   zip: string;
//   country: string;
//   phone: string;
//   sabreCode: string;
//   comments: string;
//   sabreEntry() {
//     return (
//       "0HHT" +
//       this.chainCode +
//       "GK" +
//       this.roomCount +
//       this.cityCode +
//       "IN" +
//       this.checkIn +
//       "-OUT" +
//       this.checkOut +
//       "/" +
//       this.chainCode +
//       " " +
//       this.propertyName +
//       "/" +
//       this.roomType +
//       "/" +
//       this.roomRate +
//       this.currency +
//       "/G/" +
//       this.commission +
//       "/SI-¤" +
//       this.address1 +
//       "¥" +
//       this.address2 +
//       "¥FONE " +
//       this.phone +
//       "¤PC" +
//       this.sabreCode +
//       "/C-" +
//       this.cancelPolicy +
//       "/CF-" +
//       this.confirmationNumber
//     );
//   }
export class HotelPassivePopover extends React.Component<
  SOAPServicePopoverProps,
  SOAPServicePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleGetHotelSegments = this.handleGetHotelSegments.bind(this);
    this.handlePrePopulateForm = this.handlePrePopulateForm.bind(this);
    this.handleGetSars = this.handleGetSars.bind(this);
    this.handleAddSar = this.handleAddSar.bind(this);
    this.handleDeleteSar = this.handleDeleteSar.bind(this);
    this.handleToFixedDec = this.handleToFixedDec.bind(this);
  }

  state: SOAPServicePopoverState = {
    actionCode: "",
    payload: "",
    response: "",
    rsfilter: "",
    shouldParse: false,
    show: false,
    hotelList: [],
    remarksList: [],
    sarsList: [],
    selectedHotelId: null,
    thisHotel: {
      segment: "",
      xk: false,
      id: null,
      chainCode: "",
      propertyName: "",
      checkIn: "",
      checkOut: "",
      nights: null,
      roomCount: 1,
      confirmationNumber: "",
      cancelPolicy: "6P",
      commission: "",
      roomType: "ROH",
      currency: "",
      roomRate: null,
      cityCode: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      phone: "",
      sabreCode: "",
      comments: "",
    },
    addNewSar: false,
    xk: false,
    lastSarIndex: 1000,
  };

  componentDidMount(): void {
    console.log("Getting PNR Info....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise
      .then(this.handleGetHotelSegments.bind(this))
      .catch((error) => {
        console.log("Error while receiving reservation");
        console.log(error);
      });
  }

  handleGetThisHotel(e): void {
    // get this hotel
    const value: any = parseInt(e.target.value);
    console.log(
      `OK, let's prepopulate the form with hotelid=${value} was ${this.state.selectedHotelId}`
    );
    const foundHotel = this.state.hotelList.find((h) => h.Id === value);

    if (foundHotel !== undefined) {
      this.handlePrePopulateForm(foundHotel);
    } else {
      // blank out the form
      this.setState({
        show: false,
      });
    }
  }

  handleGetHotelSegments(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    // from the entire reservation just get hotel segments
    var reservation = commandMessageReservationRs["Data"];
    console.log(reservation);
    var hotels = reservation.Segments.HotelSegments.Hotel;
    this.setState({
      hotelList: hotels,
    });
    // get the remarks as we will look for sar remarks
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
      this.handlePrePopulateForm(hotels[0]);
    } else {
      // they must choose a hotel first
      console.log(`user must choose the hotel`);
    }
  }

  handlePrePopulateForm(hotel): void {
    // a hotel = the parameter is a single hotel object
    console.log(
      `this is the hotel object ${
        hotel.HotelInformation.Name
      } start pre-populating ${typeof hotel}`
    );

    let theHotel = new PassiveHotelSegment();
    theHotel.roomRate = parseInt(
      hotel.ReservationDetails.Rates.NightlyRate.Amount
    ).toFixed(2);
    theHotel.checkIn = hotel.ReservationDetails.CheckIn.substring(0, 10);
    theHotel.checkOut = hotel.ReservationDetails.CheckOut.substring(0, 10);
    theHotel.chainCode = hotel.HotelInformation.ChainCode;
    theHotel.propertyName = hotel.HotelInformation.Name;
    theHotel.roomType = hotel.ReservationDetails.RoomTypeCode;
    theHotel.currency = hotel.ReservationDetails.Rates.NightlyRate.Currency;
    theHotel.roomCount = hotel.ReservationDetails.NumberOfUnits;
    theHotel.confirmationNumber = hotel.ReservationDetails.Confirmation;
    theHotel.cancelPolicy =
      hotel.ReservationDetails.CancellationPolicy.PolicyCode;
    theHotel.nights = hotel.ReservationDetails.Duration;
    theHotel.cityCode = hotel.HotelInformation.ChainCode;
    theHotel.address1 = hotel.HotelInformation.Address.AddressLine[0];
    theHotel.address2 = hotel.HotelInformation.Address.AddressLine[1];
    theHotel.phone = hotel.HotelInformation.PhoneNumber;
    theHotel.sabreCode = hotel.HotelInformation.SabreCode;
    theHotel.id = hotel.Id;
    theHotel.xk = false;

    // segment: "",
    // id: null,
    // commission: "",
    // city: "",
    // state: "",
    // zip: "",
    // country: "",
    // comments: "",

    this.setState({
      thisHotel: theHotel,
    });
    console.log(`end of prepoulation for  ${hotel.HotelInformation.Name} `);
    // gets sars for this hotel
    this.handleGetSars(theHotel.id);
  }

  handleGetSars(hotelid): void {
    // find sars for this segment
    console.log(`searching for id=${hotelid} in ${this.state.remarksList}`);
    const sars: any = this.state.remarksList.filter(function (i) {
      return i.SegmentAssociation && i.SegmentAssociation.SegmentIds == hotelid;
    });
    const sars3 = sars.map(({ Id, Text }) => ({
      Id,
      Text,
      Keep: true,
    }));
    if (sars3.length > 0) {
      //do what
      console.log(sars3);
      this.setState({
        sarsList: sars3,
      });
    }
  }

  handleAddSar(): void {
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

  handleDeleteSar = (id: number) => (e): void => {
    console.log(`**** Delete line ${id} ****`);
    let tempList = this.state.sarsList;
    let itemtodelete: number = null;

    tempList.forEach((i, index) => {
      if (i.Id == id) {
        itemtodelete = index;
      }
    });

    // remove from our temp list
    tempList.splice(itemtodelete, 1);
    // update state to reflect the item being removed
    this.setState({
      sarsList: tempList,
    });
  };

  handleChangeSar = (id: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
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

  // changes a number field to 2 decimal places
  public handleToFixedDec = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name: any = e.target.name;
    let value: any = e.target.value;
    let tempvalue = parseInt(value).toFixed(2);
    this.setState({
      thisHotel: {
        ...this.state.thisHotel,
        roomRate: tempvalue,
      },
    });
  };

  handleChange = (e): void => {
    let value: any = e.target.value;
    let name: any = e.target.name;
    console.log(`changing ${name}`);
    // do this for all

    if (name === "nights") {
      // set the check out when they change the nights
      console.log(`nts now ${value}`);

      let newCheckOut = moment(this.state.thisHotel.checkIn)
        .add(value, "d")
        .format("YYYY-MM-DD");
      console.log(newCheckOut);

      this.setState({
        thisHotel: {
          ...this.state.thisHotel,
          checkOut: newCheckOut,
          nights: value,
        },
      });
    } else if (name === "checkOut") {
      // set the nights when they change the check out
      console.log(`chk out now ${value}`);
      let dChkIn = moment(this.state.thisHotel.checkIn);
      let dChkOut = moment(value);
      let diff = dChkOut.diff(dChkIn, "days");
      console.log(diff);

      this.setState({
        thisHotel: {
          ...this.state.thisHotel,
          nights: diff,
          checkOut: value,
        },
      });
    } else {
      this.setState({
        thisHotel: { ...this.state.thisHotel, [name]: value },
      });
    }
  };
  handleCheck(e?): void {
    this.setState({
      thisHotel: {
        ...this.state.thisHotel,
        [e.target.name]: e.target.checked,
      },
    });
  }

  handleExecute(): void {
    console.log("will execute");
    console.log(this.state.thisHotel);

    // getService(CommFoundHelper)
    //   .sendSWSRequest({
    //     action: this.state.actionCode,
    //     payload: this.state.payload,
    //     authTokenType: "SESSION",
    //   })
    //   .then((res) => {
    //     this.setState({
    //       response: res.errorCode ? JSON.stringify(res, null, 2) : res.value,
    //     });
    //   });
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
    const howmany: number = this.state.hotelList.length;
    const sarsCount: number = this.state.sarsList.length;
    let dropdownList;
    //   this isn't working....
    if (howmany > 1) {
      dropdownList = <option value="">Select a hotel please.....</option>;
    }

    return (
      <PopoverFormSAS
        name=""
        title="Manual Hotels"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <form id="FormHkToYk" onSubmit={this.handleExecute} ref="form">
          <div className="form-row">
            <div className="form-group col-md-11">
              <label htmlFor="hotelList">Hotel List ({howmany})</label>
              <select
                className="form-control"
                name="hotelList"
                onChange={this.handleGetThisHotel.bind(this)}
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
                checked={this.state.thisHotel.xk}
                onChange={this.handleCheck}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="checkIn" className="form-label">
                Check in
              </label>
              <input
                type="date"
                className="form-control text-uppercase"
                name="checkIn"
                value={this.state.thisHotel.checkIn}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="nights">Nights</label>
              <input
                type="text"
                className="form-control"
                name="nights"
                value={this.state.thisHotel.nights}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="checkOut">Check out</label>
              <input
                type="date"
                className="form-control text-uppercase"
                name="checkOut"
                value={this.state.thisHotel.checkOut}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="ipRoomCount">Number of rooms</label>
              <input
                type="text"
                className="form-control"
                name="roomCount"
                placeholder="1"
                value={this.state.thisHotel.roomCount}
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
                value={this.state.thisHotel.roomType}
                name="roomType"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipCurrency">Currency</label>
              <input
                type="text"
                className="form-control text-uppercase"
                name="currency"
                value={this.state.thisHotel.currency}
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipAmount">Amount</label>
              <input
                type="number"
                className="form-control noarrows"
                name="roomRate"
                placeholder="Nightly Rate ##.##"
                value={this.state.thisHotel.roomRate}
                onChange={this.handleChange}
                onBlur={this.handleToFixedDec}
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
                name="confirmationNumber"
                value={this.state.thisHotel.confirmationNumber}
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
                name="cancelPolicy"
                value={this.state.thisHotel.cancelPolicy}
                placeholder="6P"
                onChange={this.handleChange}
                required
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipHotelComm">Commissionable</label>
              <select
                className="form-control"
                name="commission"
                value={this.state.thisHotel.commission}
                onChange={this.handleChange}
              >
                <option value="CMN-C">Yes</option>
                <option value="CMN-NC">No</option>
              </select>
            </div>
          </div>
          <div className="sars">
            <label htmlFor="SARS">Segment Associated Remarks</label>
            {this.state.sarsList.map((s) => (
              <div key={s.Id} className="form-row">
                <div className="form-group col-md-11">
                  <input
                    name="Text"
                    placeholder="Text Remark"
                    type="text"
                    className="form-control"
                    value={s.Text}
                    onChange={this.handleChangeSar(s.Id)}
                  />
                </div>
                <div className="form-group col-md-1">
                  <i
                    className="fa fa-trash-alt"
                    onClick={this.handleDeleteSar(s.Id)}
                  />
                </div>
              </div>
            ))}
            <div className="row">
              <div className="col-md-12">
                <BtnBs onClick={this.handleAddSar}>
                  <i className="fa fa-plus"></i>
                </BtnBs>
              </div>
            </div>
          </div>
        </form>
      </PopoverFormSAS>
    );
  }
}
