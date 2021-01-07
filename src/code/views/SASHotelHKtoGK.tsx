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
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
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
  selectedHotelId: number;
  thisHotel: any;
}

export class SASHotelHKtoGK extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.closePopovers = this.closePopovers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayHotelSegment = this.displayHotelSegment.bind(this);

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
      selectedHotelId: null,
      thisHotel: {},
    };
    //const baseState = this.state;
  }

  //   resetForm = () => {
  //     this.setState(baseState);
  //   };

  componentDidMount() {
    console.log("Getting Hotel Segments....");
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
  // get hotel list
  //   getHotelSegments = (): void => {
  //     console.log("Getting Hotel Segments....");
  //     let reservationPromise: Promise<CommandMessageReservationRs> = getService(
  //       IReservationService
  //     ).getReservation();
  //     reservationPromise
  //       .then(this.displayHotelSegment.bind(this))
  //       .catch((error) => {
  //         console.log("Error while receiving reservation");
  //         console.log(error);
  //       });
  //   };

  private displayHotelSegment(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"];
    console.log(reservation.Segments.HotelSegments);
    var hotels = reservation.Segments.HotelSegments.Hotel;
    this.setState({
      hotelList: hotels,
    });
    console.log(
      `${this.state.hotelList.length} hotels in state = ${this.state.hotelList}`
    );
    if (this.state.hotelList.length === 1) {
      // pre-populate the form
      console.log(`we need to pre-populate the form as there is only 1 hotel`);
    } else {
      // they must choose a hotel first
      console.log(`user must choose the hotel`);
    }
  }

  // handle change of value
  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    this.setState({
      [name]: value,
    });
  };

  handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value: any = event.currentTarget.value;
    const name: any = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    this.setState({
      [name]: value,
    });
  };

  handlePrePopulateForm = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value: any = parseInt(event.target.value);
    console.log(
      `OK, let's prepopulate the form with hotelid=${value} was ${this.state.selectedHotelId}`
    );

    const foundHotel = this.state.hotelList.find((h) => h.Id === value);

    console.log(foundHotel);

    if (foundHotel !== undefined) {
      this.setState({
        thisHotel: foundHotel,
        ipCheckIn: foundHotel.ReservationDetails.CheckIn.substring(0, 10),
        ipCheckOut: foundHotel.ReservationDetails.CheckOut.substring(0, 10),
        ipRoomType: foundHotel.ReservationDetails.RoomTypeCode,
        ipCurrency: foundHotel.ReservationDetails.Rates.NightlyRate.Currency,
        ipAmount: foundHotel.ReservationDetails.Rates.NightlyRate.Amount,
        ipRoomCount: foundHotel.ReservationDetails.NumberOfUnits,
        ipConfirmationNumber: foundHotel.ReservationDetails.Confirmation,
        ipCancelPolicy:
          foundHotel.ReservationDetails.CancellationPolicy.PolicyCode,
        ipHotelComm: "CMN-NC",
        ipNights: foundHotel.ReservationDetails.Duration,
      });
      console.log("Match on " + foundHotel.HotelInformation.Name);
    } else {
      //reset form to blank
      //this.resetForm;
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
    // for (var i = 0; i < this.state.hotelList.length; i++) {
    //   var x = this.state.hotelList[i];
    //   console.log("Looping thru " + x.Id + " checking for " + value);
    //   if (x.Id === value) {
    //     console.log(
    //       "Match on " + x.HotelInformation.Name + " Changing Values now..."
    //     );
    //     this.setState({
    //       thisHotel: x,
    //       ipCheckIn: x.ReservationDetails.CheckIn.substring(0, 10),
    //       ipCheckOut: x.ReservationDetails.CheckOut.substring(0, 10),
    //       ipRoomType: x.ReservationDetails.RoomTypeCode,
    //       ipCurrency: x.ReservationDetails.Rates.NightlyRate.Currency,
    //       ipAmount: x.ReservationDetails.Rates.NightlyRate.Amount,
    //       ipRoomCount: x.ReservationDetails.NumberOfUnits,
    //       ipConfirmationNumber: x.ReservationDetails.Confirmation,
    //       ipCancelPolicy:
    //         x.ReservationDetails.CancellationPolicy.PolicyCode,
    //       ipHotelComm: "CMN-NC",
    //       ipNights: x.ReservationDetails.Duration,
    //     });
    //     console.log("Match on " + x.HotelInformation.Name);
    //     break;
    //   }
    // }
  };

  handlePrePopulateForm2 = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const value: any = parseInt(event.target.value);
    console.log(
      `OK, let's prepopulate the form with hotelid=${value} was ${this.state.selectedHotelId}`
    );
    // this.setState(
    //     {
    //         selectedHotelId: value,
    //     },
    //     () => {
    //         console.log(`new state: ${this.state.selectedHotelId}`);
    //     }
    // );
    this.setState(
      (state: MyState) => ({
        selectedHotelId: value,
      }),
      () => {
        console.log(`inside set new state: ${this.state.selectedHotelId}`);
      }
    );
    console.log(`new state: ${this.state.selectedHotelId}`);
    //this.syncSubmit(event.currentTarget.value);
    // loop through all the hotels and locate the specific segment
    for (var i = 0; i < this.state.hotelList.length; i++) {
      var x = this.state.hotelList[i];
      console.log(
        "Looping thru " + x.Id + " checking for " + this.state.selectedHotelId
      );
      if (x.Id === this.state.selectedHotelId) {
        console.log(
          "Match on " + x.HotelInformation.Name + " Changing Values now..."
        );
        this.setState({
          thisHotel: x,
          ipCheckIn: x.ReservationDetails.CheckIn.substring(0, 10),
          ipCheckOut: x.ReservationDetails.CheckOut.substring(0, 10),
          ipRoomType: x.ReservationDetails.RoomTypeCode,
          ipCurrency: x.ReservationDetails.Rates.NightlyRate.Currency,
          ipAmount: x.ReservationDetails.Rates.NightlyRate.Amount,
          ipRoomCount: x.ReservationDetails.NumberOfUnits,
          ipConfirmationNumber: x.ReservationDetails.Confirmation,
          ipCancelPolicy: x.ReservationDetails.CancellationPolicy.PolicyCode,
          ipHotelComm: "CMN-NC",
          ipNights: x.ReservationDetails.Duration,
        });
        console.log("Match on " + x.HotelInformation.Name);
        break;
      }
    }
  };

  // handle submit
  handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`I clicked submit ${event}`);
  };

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }
  // function for nights or check out change to update each other

  // form validation
  // if the country = US then currency must be USD else warning
  // if foreign currency check the rate to make sure between $50 and $1000
  // do we want typeahead for room type?
  // do we need dropdown for cancel policy
  // must have values everywhere

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="hotelscript">
        <p>Convert HK to Passive Segment</p>
        {/* <Button type="submit" onClick={this.getHotelSegments}>
          Get Hotels
        </Button> */}
        <form id="FormHkToYk" onSubmit={this.handleSubmit} ref="form">
          <div className="form-row">
            <label htmlFor="hotelList">Hotel List</label>
            <select
              className="form-control"
              name="hotelList"
              onChange={this.handlePrePopulateForm}
            >
              <option value="">Choose a hotel </option>
              {this.state.hotelList.map((h) => (
                <option key={h.Id} value={h.Id}>
                  {h.Id}- {h.HotelInformation.Name} -{" "}
                  {h.ReservationDetails.CheckIn}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="ipCheckIn" className="form-label">
                Check in
              </label>
              <input
                type="date"
                className="form-control"
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
                className="form-control"
                name="ipCheckOut"
                value={this.state.ipCheckOut}
                onChange={this.handleChange}
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
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="ipRoomType">Room type</label>
              <input
                type="text"
                className="form-control"
                value={this.state.ipRoomType}
                name="ipRoomType"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipCurrency">Currency</label>
              <input
                type="text"
                className="form-control"
                name="ipCurrency"
                value={this.state.ipCurrency}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipAmount">Amount</label>
              <input
                type="text"
                className="form-control"
                name="ipAmount"
                placeholder="Nightly Rate ##.##"
                value={this.state.ipAmount}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="ipConfirmationNumber">Confirmation number</label>
              <input
                type="text"
                className="form-control"
                name="ipConfirmationNumber"
                value={this.state.ipConfirmationNumber}
                placeholder="CF#"
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="ipCancelPolicy">Cancellation Policy</label>
              <input
                type="text"
                className="form-control"
                name="ipCancelPolicy"
                value={this.state.ipCancelPolicy}
                placeholder="6P"
                onChange={this.handleChange}
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
          <div className="form-row">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  }
}
