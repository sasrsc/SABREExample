import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
const eventBus: AbstractModel = new AbstractModel();
import { context } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { Alert } from "react-bootstrap";
import { IReservationService } from "sabre-ngv-reservation/services/IReservationService";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";

export interface MyProps {
  closePopovers: () => void;
}

export interface MyState {
  remarks?: any;
}

export class SAS3view extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.closePopovers = this.closePopovers.bind(this);
    this.state = {
      remarks: [],
    };
  }

  // getting pnr QC remarks
  componentDidMount() {
    console.log("Getting QC remarks....");
    let reservationPromise: Promise<CommandMessageReservationRs> = getService(
      IReservationService
    ).getReservation();
    reservationPromise.then(this.displayRemarks.bind(this)).catch((error) => {
      console.log("Error while receiving reservation");
      console.log(error);
    });
  }

  private displayRemarks(
    commandMessageReservationRs: CommandMessageReservationRs
  ): void {
    var reservation = commandMessageReservationRs["Data"].Remarks.Remark;
    console.log(`reservation=${reservation}`);
    // only keep code=Q
    const remarks: any = reservation.filter(function (r) {
      return r.Code && r.Code === "Q";
    });
    console.log(`remarks=${remarks}`);

    remarks.sort(function (remark1, remark2) {
      return remark1.OrderNumber - remark2.OrderNumber;
    });

    this.setState({
      remarks: remarks,
    });
    console.log(remarks);
  }

  private closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  private handleChange = (id: number) => (
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
    const responses = this.state.remarks.map((i) =>
      i.Id == id ? { ...i, [name]: value } : i
    );

    this.setState({
      remarks: responses,
    });
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    //this.props.closePopovers();
    console.log(`I clicked cancel ${event}`);
    this.closePopovers();
  };

  public handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`I clicked submit ${event}`);
  };

  // get queue info

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="3">
        <h3>Quality Control Remarks</h3>
        <div className="qcremarks">
          <form id="QCForm" onSubmit={this.handleSubmit} ref="form">
            {this.state.remarks.map((s) => (
              <div key={s.Id} className="form-row">
                <div className="form-group col-md-1">
                  <input
                    type="checkbox"
                    name="Keep"
                    checked={s.Keep}
                    onChange={this.handleChange(s.Id)}
                  />
                </div>

                <div className="form-group col-md-11">
                  <input
                    name="Text"
                    placeholder="Text Remark"
                    type="text"
                    className="form-control"
                    value={s.Text}
                    onChange={this.handleChange(s.Id)}
                  />
                </div>
              </div>
            ))}
          </form>
        </div>
      </div>
    );
  }
}
