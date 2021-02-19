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
  endpoint?: string;
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
      endpoint:
        "https://graph.microsoft.com/v1.0/sites/sasoffice365.sharepoint.com/:/sites/CorporateTravelUS:/lists",
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

  private handleSampleApi = async (
    event?: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    console.log(`Attempting to make Sample API call`);
    let url: string =
      "https://newsapi.org/v2/top-headlines?country=us&apiKey=aac4480daf03460fb800302e5b81a649";
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const responseApi = result.map((item) => {
          return item;
        });
        console.log(responseApi);
      })
      .catch((err) => {
        console.log("Error reading json file " + err);
      });
  };

  private handleSubmitExternal = async (
    event?: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event && event.preventDefault();
    console.log(`Attempting to make API call`);
    let url: string = this.state.endpoint;
    let oauth_bearer: string =
      "0.AAAAXE3BsSU2s0WkMJVSNzoML8bVN7sw3VhCmcPjg8T2B-BXAHo.AQABAAIAAABeStGSRwwnTq2vHplZ9KL4zwJkvOhbN6sKVfub2kfGMm8HiTwNTPiCKnyOSmbrscgdqp7ZNDusK5xwra30EyoBc4W8ugA4ulxZTyFd8VpoUpHOhLBEgQ6RqJMc7Og2Sgs7e64rVr0j1XlOJrsaU75ezMqkPpHH7cUr9LiTL2QE6LS7i8lPV2SohSk8Pu_chWtHwahrFcWeV_OL6bDJ5aFLSpy18RycA56kKgKw9rbYJZhSnsN_CcDpF_gC0uX4Ma67N-bRE9WIXcJAaIoc-JgA0RaDnM5ePLl4KxdgsBj_4olz0fesBOYR0xoVn7dwCtE8mA3ndmIe5P5w-17zdRKz0QOPW-TXIcpxzeJRv3qrv6x2NSPXaTVJ7Iy3G-V3cBQTop3JI5erto8xFF-RR1-ADB3kYg3VNhRNX8BF5rlAjeU7vKmUSyUj5lo23cFXW3sZiOPuo3l4OHTp3ecvVUqdRgvY3fiH6FoQzTJnxjv0oB8USuFXY9yqILlQ4vXgRTuCbPMN_m1_a3y3EL_SioXuyu2ngEVdhj64BlHzz6iI_B2sxQXlYPpS0WquDuCM6XZsxzDm0myiN_isvrB4r4svkx4csFcQ9WL0rdzVLav-MU4Rw0hbxza-zwyOPJW5KEZ8IY8-IJBAgULbEGPEnzNADM6IYff_K8rrq1peeRwuVIQD8Sw2Nug8YYHdH6fFIEAgAA";

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const responseApi = result.map((item) => {
          return item;
        });
        console.log(responseApi);
      })
      .catch((err) => {
        console.log("Error reading json file " + err);
      });
  };

  handleSubmitSas = async (
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
      <>
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
          <form onSubmit={this.handleSubmitSas} ref="form">
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
          <p>
            This is a 2nd form and will submit the value in the input field.
          </p>
          <form onSubmit={this.handleSubmitExternal} ref="form">
            <div className="fields-container">
              <div className="row">
                <label className="col-md-3 col-form-label">EndPoint</label>
                <div className="col-md-9">
                  <input
                    type="text"
                    className="form-control"
                    name="endpoint"
                    placeholder="full end point"
                    value={this.state.endpoint}
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
          <div className="buttons-container">
            <div className="row">
              <div className="right-buttons">
                <button
                  type="submit"
                  id="submit-button"
                  onClick={this.handleSampleApi}
                  className="submit-button btn btn-success"
                >
                  Sample News API
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
