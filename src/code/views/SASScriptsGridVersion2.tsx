import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { SASHeaderTemplate } from "./SASHeaderTemplate";
import { SASFooterTemplate } from "./SASFooterTemplate";
import { SASInfoQC } from "./SASInfoQC";
import { SASQueueSend } from "./SASQueueSend";
import { SASAppDispatcher } from "./SASAppDispatcherCall";
import { SASFormModal } from "./SASFormModal";
import { Alert, Panel, Badge, Button } from "react-bootstrap";
import { LayerService } from "sabre-ngv-core/services/LayerService";
import { SASHotelHKtoGK } from "./SASHotelHKtoGK";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
  firstName: string;
  lastName: string;
}

export class SASScriptsGridVersion2 extends React.Component<{}, OwnState> {
  private readonly formsService: IFormsService = getService<IFormsService>(
    IFormsService
  );

  state: OwnState = {
    showThis: true,
    firstName: "Richard",
    lastName: "Clowes",
  };

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

  private submitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log(`I clicked on submit`);
    // send name to sabre
    let sabreentry = `-${this.state.lastName}/${this.state.firstName}`;
    getService(NativeSabreCommand).handleSubmit(sabreentry);
  };

  render(): JSX.Element {
    return (
      <div className="sas_scripts_grid">
        <SASHeaderTemplate />
        <aside>
          <ul className="nav nav-tabs">
            <li className="active">
              <a href="#air" data-toggle="tab">
                <span className="fa fa-plane"></span>
              </a>
            </li>
            <li>
              <a href="#hotel" data-toggle="tab">
                <span className="fa fa-bed"></span>
              </a>
            </li>
            <li>
              <a href="#car" data-toggle="tab">
                <span className="fa fa-car"></span>
              </a>
            </li>
            <li>
              <a href="#qc" data-toggle="tab">
                <span className="fa fa-edit"></span>
              </a>
            </li>
            <li>
              <a href="#queues" data-toggle="tab">
                <span className="fa fa-passport"></span>
              </a>
            </li>
            <li>
              <a href="#sasappdispatcher" data-toggle="tab">
                <span className="fa fa-phone-volume"></span>
              </a>
            </li>
            <li>
              <a href="#hotelscript" data-toggle="tab">
                <span className="fa fa-hotel"></span>
              </a>
            </li>
          </ul>
        </aside>
        <article>
          <div className="tab-pane active" id="air">
            <h3>Air Stuff</h3>
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
            <h3>Hotel Stuff</h3>
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
            <form className="row g-3" onSubmit={this.submitHandler.bind(this)}>
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
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </form>
          </div>

          <div className="tab-pane" id="car">
            <h3>Car Stuff</h3>
            <p>Something about hotels goes here.</p>
          </div>
          <SASInfoQC />
          <SASQueueSend closePopovers={() => {}} />
          <SASAppDispatcher closePopovers={() => {}} />
          <SASHotelHKtoGK closePopovers={() => {}} />
        </article>
        <SASFooterTemplate />
      </div>
    );
  }
}
