import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
const eventBus: AbstractModel = new AbstractModel();
import { context } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { Alert } from "react-bootstrap";

export interface MyProps {
  closePopovers: () => void;
}

export interface MyState {
  command?: string;
  soccer?: string;
  firstName?: string;
  responseMessage?: string;
  lastName?: string;
  isError?: boolean;
  jsonData?: any;
  isLoading?: boolean;
  lastIndex?: number;
  filename?: string;
}

export class SASAppDispatcher extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.closePopovers = this.closePopovers.bind(this);
    this.state = {
      command: "5test",
      soccer: "Man City",
      responseMessage: "",
      jsonData: [],
      isLoading: false,
      isError: false,
      lastIndex: 0,
      firstName: "",
      lastName: "",
      filename: "jsonRefPoints.sas&action=getRefPoints&isActive=1",
    };
  }

  private closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.currentTarget.value;
    const name: string = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    this.setState({
      [name]: value,
    });
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    //this.props.closePopovers();
    console.log(`I clicked cancel ${event}`);
    this.closePopovers();
  };

  handleSubmit = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`I clicked submit ${event}`);
    //**************************************** */
    // let url: string =
    //   "https://sww.sas.com/sww-bin/broker94?_service=appprod94&_program=tasprod.";

    let url: string = "https://travel.sas.com/";
    //let file: string = `${url}${this.state.filename}`;
    let file: string = `${url}`;
    this.setState({
      isLoading: true,
    });
    console.log(`IsLoading=${this.state.isLoading}`);
    console.log(`Making a call to "${file}"`);

    fetch(file, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const tempData = result.map((item) => {
          item.Id = this.state.lastIndex;
          item.isSelected = false;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        this.setState({
          jsonData: tempData,
          isLoading: false,
        });
        console.log(this.state.jsonData);
        console.log(`IsLoading=${this.state.isLoading}`);
      })
      .catch((err) => {
        console.log("Error reading json file " + err);
        this.setState({
          isError: true,
          responseMessage: `Msg: Error reading json file: ${err}`,
          isLoading: false,
        });
      });
  };

  // get queue info

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="sasappdispatcher">
        {this.state.isLoading ? (
          <div className="alert alert-primary" role="alert">
            Loading Data....
          </div>
        ) : null}
        {this.state.isError ? (
          <Alert bsStyle="warning">{this.state.responseMessage}</Alert>
        ) : null}
        <p>
          The suffix for the api call is:
          https://sww.sas.com/sww-bin/broker94?_service=appprod94&amp;_program=tasprod.
        </p>
        <form onSubmit={this.handleSubmit} ref="form">
          <div className="fields-container">
            <div className="row">
              <label className="col-md-3 col-form-label">file name ...</label>
              <div className="col-md-9">
                <input
                  type="text"
                  className="form-control"
                  name="filename"
                  placeholder="filename"
                  aria-label="filename"
                  id="filename"
                  value={this.state.filename}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>

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
        </form>
      </div>
    );
  }
}
