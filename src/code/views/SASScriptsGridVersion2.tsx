import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { SASHeaderTemplateContext } from "./SASHeaderTemplateContext";
import { SASFooterTemplate } from "./SASFooterTemplate";
import { SASInfoQC } from "./SASInfoQC";
import { SASQueueSend } from "./SASQueueSend";
import { SASAppDispatcher } from "./SASAppDispatcherCall";
import { SASFormModal } from "./SASFormModal";
import { SASRedux } from "./SASRedux";
import { SASPassport } from "./SASPassport";
import {
  Alert,
  Panel,
  Badge,
  Button,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
} from "react-bootstrap";
import { LayerService } from "sabre-ngv-core/services/LayerService";
import { SASHotelHKtoGK } from "./SASHotelHKtoGK";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { PersistModel } from "../models/PersistModel";
import { Data, LocalStore } from "../services/LocalStore";

const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
  firstName: string;
  lastName: string;
  headerText: string;
  color: string;
}

export class SASScriptsGridVersion2 extends React.Component<{}, OwnState> {
  constructor(props = {}) {
    super(props);

    this.state = {
      showThis: true,
      firstName: "Richard",
      lastName: "Clowes",
      headerText: "Air Info",
      color: "blue",
    };

    this.handleClick = this.handleClick.bind(this);
  }

  private readonly formsService: IFormsService = getService<IFormsService>(
    IFormsService
  );

  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("I clicked on submit for the SAS Form Extends");
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("I clicked on cancel for the SAS Scripts");
    event.preventDefault();
  };

  private changeHandler(e) {
    const field = e.target.name;
    const value = e.target.value;
    this.setState({
      [field]: value,
    });
  }

  private onRadioChange = (e) => {
    this.setState({
      color: e.target.value,
    });
  };

  private submitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log(`I clicked on submit`);
    // send name to sabre
    let sabreentry = `-${this.state.lastName}/${this.state.firstName}`;
    getService(NativeSabreCommand).handleSubmit(sabreentry);
  };

  private handleClick = (txt: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({
      headerText: txt,
    });
    console.log(`**** Opening ${txt} section ****`);
  };

  render(): JSX.Element {
    return (
      <div className="sas_scripts_grid">
        <SASHeaderTemplateContext headertext={this.state.headerText} />
        <aside>
          <ul className="nav nav-tabs">
            <li className="active">
              <a
                href="#air"
                onClick={this.handleClick("Air Info")}
                data-toggle="tab"
              >
                <span className="fa fa-plane"></span>
              </a>
            </li>
            <li>
              <a
                href="#hotel"
                onClick={this.handleClick("Hotel Info")}
                data-toggle="tab"
              >
                <span className="fa fa-bed"></span>
              </a>
            </li>
            <li>
              <a
                href="#car"
                onClick={this.handleClick("Car Info")}
                data-toggle="tab"
              >
                <span className="fa fa-car"></span>
              </a>
            </li>
            <li>
              <a
                href="#qc"
                onClick={this.handleClick("QC Info")}
                data-toggle="tab"
              >
                <span className="fa fa-edit"></span>
              </a>
            </li>
            <li>
              <a
                href="#queues"
                onClick={this.handleClick(
                  "Queue Placement and Itinerary Alerts"
                )}
                data-toggle="tab"
              >
                <span className="fa fa-passport"></span>
              </a>
            </li>
            <li>
              <a
                href="#sasappdispatcher"
                onClick={this.handleClick("App Dispatcher Info")}
                data-toggle="tab"
              >
                <span className="fa fa-phone-volume"></span>
              </a>
            </li>
            <li>
              <a
                href="#hotelscript"
                onClick={this.handleClick("Passive Hotel")}
                data-toggle="tab"
              >
                <span className="fa fa-hotel"></span>
              </a>
            </li>

            <li>
              <a
                href="#redux"
                onClick={this.handleClick("Redux Communication")}
                data-toggle="tab"
              >
                <span className="fa fa-map"></span>
              </a>
            </li>

            <li>
              <a
                href="#passport"
                onClick={this.handleClick("Passport & Visa Documentation")}
                data-toggle="tab"
              >
                <span className="fa fa-passport"></span>
              </a>
            </li>
          </ul>
        </aside>
        <article>
          <div className="tab-pane active" id="air">
            <ul className="list-group pull-left">
              <li className="list-group-item">This script</li>
              <li className="list-group-item">That script</li>
              <li className="list-group-item">Some info blah</li>
              <li className="list-group-item">
                This is a list group in
                <a
                  href="https://getbootstrap.com/docs/5.0/components/list-group/"
                  target="_blank"
                >
                  Bootstrap
                </a>
                . It's basically a ul li group in html with a special class that
                bootstrap translates into this cool formatting.
              </li>
            </ul>
            <p>
              Something about hotels goes here. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Obcaecati fugiat architecto magni
              placeat. Tempora atque id officiis voluptatum, optio, vel adipisci
              voluptates placeat alias quis quo? Rerum sunt mollitia neque.
            </p>
          </div>
          <div className="tab-pane" id="hotel">
            <p>
              <Panel bsStyle="primary">
                <Panel.Heading>
                  <Panel.Title componentClass="h3">
                    Message from Redux
                  </Panel.Title>
                </Panel.Heading>
                <Panel.Body>Lorem</Panel.Body>
              </Panel>
              <Alert bsStyle="warning">
                This is the <Badge>42</Badge>nd warning message
              </Alert>
              <Alert bsStyle="danger">This is a danger message</Alert>
            </p>
            <form onSubmit={this.submitHandler.bind(this)}>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" />
                  <InputGroup.Addon>@</InputGroup.Addon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="Header Text"
                    name="headerText"
                    onChange={this.changeHandler.bind(this)}
                    value={this.state.headerText}
                  />
                  <InputGroup.Addon> - </InputGroup.Addon>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    placeholder="First name"
                    name="testName"
                    onChange={this.changeHandler.bind(this)}
                    value={this.state.firstName}
                  />
                  <InputGroup.Addon>
                    <i className="fa fa-minus" />
                  </InputGroup.Addon>
                </InputGroup>
              </FormGroup>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  name="testName"
                  aria-label="First name"
                  onChange={this.changeHandler.bind(this)}
                  value={this.state.firstName}
                />
                <div className="input-group-append">
                  <span className="input-group-text" id="basic-addon1">
                    @
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    name="firstName"
                    aria-label="First name"
                    onChange={this.changeHandler.bind(this)}
                    value={this.state.firstName}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    placeholder="Last name"
                    aria-label="Last name"
                    onChange={this.changeHandler.bind(this)}
                    value={this.state.lastName}
                  />
                </div>

                <div className="col-md-3">
                  <label>
                    <input
                      type="radio"
                      className="form-control"
                      name="color"
                      checked={this.state.color === "red"}
                      onChange={this.changeHandler.bind(this)}
                      value="red"
                    />
                    <span>Red</span>
                  </label>
                </div>

                <div className="col-md-3">
                  <label>
                    <input
                      type="radio"
                      className="form-control"
                      name="color"
                      checked={this.state.color === "blue"}
                      onChange={this.changeHandler.bind(this)}
                      value="blue"
                    />
                    <span>Blue</span>
                  </label>
                </div>

                <div className="col-md-3">
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
          </div>

          <div className="tab-pane" id="car">
            <p>Something about hotels goes here.</p>
          </div>
          <SASInfoQC />
          <SASQueueSend closePopovers={() => {}} />
          <SASAppDispatcher closePopovers={() => {}} />
          <SASHotelHKtoGK closePopovers={() => {}} />
          <SASRedux />
          <SASPassport />
        </article>
        {/* <SASFooterTemplate /> */}
      </div>
    );
  }
}
