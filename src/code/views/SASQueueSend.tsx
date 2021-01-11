import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { LayerService } from "sabre-ngv-core/services/LayerService";
const eventBus: AbstractModel = new AbstractModel();
import { SASFormModal } from "./SASFormModal";
import { context } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { ICommandMessageService } from "sabre-ngv-commsg/services/ICommandMessageService";
import {
  CommandMessageBasicRs,
  CommandMessageRq,
} from "sabre-ngv-pos-cdm/commsg";

import { StatusView } from "./StatusView";

export interface MyProps {
  closePopovers: () => void;
}

export interface MyState {
  command?: string;
  soccer?: string;
  firstName?: string;
  lastName?: string;
  queueList?: any;
  isLoading?: boolean;
  lastIndex?: number;
}

export class SASQueueSend extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.closePopovers = this.closePopovers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      command: "5test",
      soccer: "Man City",
      queueList: [],
      isLoading: false,
      lastIndex: 0,
      firstName: "",
      lastName: "",
    };
  }

  componentDidMount() {
    let url: string = context.getModule().getManifest().url;
    let file: string = `${url}/assets/queues.json`;
    this.setState({
      isLoading: true,
    });
    console.log(`IsLoading=${this.state.isLoading}`);

    fetch(file, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const queues = result.map((item) => {
          item.queueId = this.state.lastIndex;
          item.isSelected = false;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          queueList: queues,
          isLoading: false,
        });
        console.log(this.state.queueList);
        console.log(`IsLoading=${this.state.isLoading}`);
      })
      .catch((err) => {
        console.log("Error reading json file " + err);
      });
  }

  private closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    //this.props.closePopovers();
    console.log(`I clicked cancel ${event}`);
    this.closePopovers();
  };

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.currentTarget.value;
    const name: string = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    // this.setState((state: MyState, props: MyProps) => {
    //   return {
    //     [name]: value,
    //   };
    // });
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`I clicked submit ${event}`);
    let queues = this.state.queueList;
    let match: any[];
    match = queues
      .filter((item) => item.isSelected === true)
      .map(({ PrefNum }) => ({ PrefNum }));
    console.log(match);
    // now create a string to send to sabre

    let queuePlacement: string = "";

    for (var i = 0; i < match.length; i++) {
      var x = match[i];

      if (i === 0) {
        queuePlacement += "QPM/75/" + x.PrefNum;
      } else {
        queuePlacement += "¥75/" + x.PrefNum;
      }
    }

    if (queuePlacement != "") {
      console.log(`queuePlacement=${queuePlacement}`);

      getService(NativeSabreCommand).handleSubmit(queuePlacement);
    }

    // Hide popovers before open modal
    this.closePopovers();
    // which items were checked
  };

  handleInputChange = (event) => {
    let queues = this.state.queueList;
    let itemToUpdate: number = parseInt(event.target.value);
    console.log(`this is: ${event.target.value} ${event.target.checked} `);
    console.log(typeof event.target.value);
    console.log(typeof itemToUpdate);
    //update the specific queue that is selected
    queues.forEach((i) => {
      console.log(`Does ${i.queueId}=${itemToUpdate}`);

      if (i.queueId == itemToUpdate) {
        console.log(`found= ${i}`);

        i.isSelected = event.target.checked;
      }
    });
    this.setState({
      queueList: queues,
    });
  };

  // get queue info

  render(): JSX.Element {
    let qs = this.state.queueList;

    return (
      <div className="tab-pane" id="queues">
        <h3>Queue Placement and Itinerary Alerts</h3>

        {this.state.isLoading ? "<p>Loading Data....</p>" : null}

        <form onSubmit={this.handleSubmit} ref="form">
          <div className="fields-container">
            {/* repeat row  */}
            {this.state.queueList.length} items
            {this.state.queueList.map((q) => (
              <div className="row g-3" key={q.queueId}>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={"IsSelected" + q.queueId}
                    checked={q.isSelected}
                    value={q.queueId}
                    onChange={this.handleInputChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    {q.PrefNum} {q.Desc}
                  </label>
                </div>
              </div>
            ))}
            {/* end of repeat row */}
            <div className="buttons-container">
              <div className="row">
                <div className="right-buttons">
                  <button
                    id="cancel-button"
                    className="cancel-button btn btn-outline btn-success"
                    onClick={this.handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="submit-button"
                    className="submit-button btn btn-success"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
