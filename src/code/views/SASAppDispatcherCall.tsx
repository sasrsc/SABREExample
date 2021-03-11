import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
const eventBus: AbstractModel = new AbstractModel();
import { context } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { Alert } from "react-bootstrap";
import { CommFoundHelper } from "../services/CommFoundHelper";
import { HttpMethod } from "sabre-ngv-app/app/services/impl/HttpMethod";
import { RestApiService } from "sabre-ngv-communication/services/RestApiService";
import { RestResponse } from "sabre-ngv-communication/interfaces/RestResponse";
import { RestRq } from "sabre-ngv-communication/interfaces/RestRq";
import { AutoComplete } from "../components/AutoComplete";
import { Button } from "../components/Button";

export interface MyProps {
  closePopovers: () => void;
}

export class jsonItem {
  key: string;
  value: string;
}
export interface MyState {
  command?: string;
  soccer?: string;
  firstName?: string;
  responseMessage?: string;
  lastName?: string;
  isError?: boolean;
  jsonData?: Array<jsonItem>;
  isLoading?: boolean;
  lastIndex?: number;
  filename?: string;
  filename2?: string;
  endpoint?: string;
  costcenter?: string;
  itviya?: string;
  user?: string;
  password?: string;
  continentcode?: string;
  sortby?: string;
}

export class SASAppDispatcher extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.closePopovers = this.closePopovers.bind(this);
    this.handleSubmitSas = this.handleSubmitSas.bind(this);
    this.handleSubmitExternal = this.handleSubmitExternal.bind(this);

    this.state = {
      command: "5test",
      soccer: "Man City",
      responseMessage: "",
      jsonData: [],
      isLoading: false,
      isError: false,
      costcenter: "",
      lastIndex: 0,
      firstName: "",
      lastName: "",
      filename: "jsonRefPoints.sas&action=getRefPoints&isActive=1",
      endpoint:
        "https://graph.microsoft.com/v1.0/sites/sasoffice365.sharepoint.com/:/sites/CorporateTravelUS:/lists",
      itviya: "https://itviya.sas.com/SASLogon/oauth/token",
      user: "sasrsc",
      password: "",
      continentcode: "EU",
      sortby: "countrycode",
      filename2: "api.sample",
    };
  }

  private closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  handleChange(e): void {
    this.setState({ [e.target.name]: e.target.value });
  }

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

  public getSasToken = async (user: string, password: string) => {
    const url: string = this.state.itviya;
    const data = {
      grant_type: "password",
      response_type: "bearer",
      username: user,
      password: password,
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      Authorization: "Basic " + btoa("sas.ec:"),
    };

    return new Promise(function (resolve, reject) {
      $.ajax({
        url: url,
        type: "POST",
        headers: headers,
        data: data,
      }).then(function (response) {
        // Resolve the promise

        resolve(response);
        console.log(response);
      });
    });
  };

  handleSubmitSas = (event?: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Go try and reach SAS`);
    //**************************************** */
    const url2: string =
      "https://itviya.sas.com/SASJobExecution/?_PROGRAM=/Corporate%20Services/Travel%20Operations/SAS_Code/API%20Sample&&_action=execute&_output_type=json" +
      "&continentcode=" +
      this.state.continentcode +
      "&sortby=" +
      this.state.sortby;
    console.log(url2);

    const resProm = this.getSasToken("sasrsc", "H1ke1ntheMtns!").then(function (
      response
    ) {
      console.log(`Trying to get SAS Token`);
      console.log(response);
      let res: string = response["access_token"];
      console.log(res);

      const headers = {
        Accept: "application/vnd.sas.collection+json",
        Authorization: "Bearer " + res,
      };
      // Call the REST API endpoint for folders
      $.ajax({
        //url: "https://itviya.sas.com/folders/folders",
        url: url2,
        type: "GET",
        headers: headers,
      }).then(function (response) {
        // Display the list of folders in the browser console log
        console.log(response);
      });
    });
  };

  handleSubmitSas2 = (event?: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`Calling SAS Rest API`);
    //**************************************** */
    const url2: string =
      "https://itviya.sas.com/SASJobExecution/?_PROGRAM=/Corporate%20Services/Travel%20Operations/SAS_Code/sabreApi&&_action=execute&_output_type=json" +
      "&filename=" +
      this.state.filename2;
    console.log(url2);
    let jsonArray = [];

    const resProm = this.getSasToken("sasrsc", "H1ke1ntheMtns!").then(function (
      response
    ) {
      console.log(`Trying to get SAS Token`);
      console.log(response);
      let res: string = response["access_token"];
      console.log(res);

      const headers = {
        Accept: "application/vnd.sas.collection+json",
        Authorization: "Bearer " + res,
      };
      // Call the REST API endpoint for folders
      $.ajax({
        //url: "https://itviya.sas.com/folders/folders",
        url: url2,
        type: "GET",
        headers: headers,
      }).then(function (response) {
        // Display the list of folders in the browser console log
        console.log(response);
        const items = response.json();
        console.log(items);

        console.log(response[2]);
        this.setState({
          jsonData: items,
        });
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

          <form onSubmit={this.handleSubmitSas} ref="form">
            <div className="container">
              <div className="row">
                <input
                  type="text"
                  className="form-control"
                  name="itviya"
                  placeholder="filename"
                  value={this.state.itviya}
                  onChange={this.handleChange}
                />
                <input
                  type="text"
                  className="form-control"
                  name="user"
                  placeholder="sasrsc"
                  value={this.state.user}
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="carynt pwd"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
                <select
                  name="continentcode"
                  className="form-control"
                  value={this.state.continentcode}
                  onChange={this.handleChange}
                >
                  <option value="AF">Africa</option>
                  <option value="AS">Asia</option>
                  <option value="AU">Australia</option>
                  <option value="EU">Europe</option>
                  <option value="NA">North America</option>
                  <option value="SA">South America</option>
                </select>
                <select
                  name="sortby"
                  className="form-control"
                  value={this.state.sortby}
                  onChange={this.handleChange}
                >
                  <option value="countrycode">Country Code</option>
                  <option value="employeehomecountryname">Country Name</option>
                </select>
                <button
                  type="submit"
                  id="submit-button"
                  className="submit-button btn btn-success"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>

          <form onSubmit={this.handleSubmitSas2} ref="form">
            <div className="container">
              <div className="row">
                <select
                  name="filename2"
                  className="form-control"
                  value={this.state.filename2}
                  onChange={this.handleChange}
                >
                  <option value="api_sample.sas">api_sample</option>
                  <option value="sabreGetCostcenters.sas">costcenters</option>
                  <option value="sabreGetProjects.sas">projects</option>
                  <option value="sabreGetGroups.sas">groups</option>
                  <option value="sabreGetLodgingLimits.sas">
                    lodging limits
                  </option>
                  <option value="sabreGetPreferredHotels.sas">
                    preferred hotels
                  </option>
                </select>
                <button
                  type="submit"
                  id="submit-button"
                  className="submit-button btn btn-success"
                >
                  Submit
                </button>
                <p>Autocomplete</p>
                {/* <AutoComplete
                  name="costcenter"
                  title="sometitle"
                  handleChange={this.handleChange}
                  value="{this.state.costcenter}"
                  placeHolder="something here"
                  options="Array<{this.state.jsonData]}{key: "{COSTCENTER}", value: "{...COSTCENTER_DESCRIPTION}"}>"
                /> */}
                {/* name:string;
    title:string;
    value:string;
    placeHolder:string;
    handleChange?:(e) => void;
    options : Array<{key:string,value:string}>; */}
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
