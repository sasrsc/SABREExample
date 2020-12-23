import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";

import { QueuePlaceFormComponent } from "./QueuePlaceFormComponent";
import { SASFormExtends } from "./SASFormExtends";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { StatusView } from "./StatusView";
import { CommandMessageBasicRs } from "sabre-ngv-pos-cdm/commsg";
import { CommandFormComponent } from "./CommandFormComponent";
import { SASFormModal } from "./SASFormModal";
import { LayerService } from "sabre-ngv-core/services/LayerService";

const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
}

export class SasScriptComponent extends React.Component<{}, OwnState> {
  private readonly formsService: IFormsService = getService<IFormsService>(
    IFormsService
  );

  state: OwnState = {
    showThis: true,
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

  render(): JSX.Element {
    return (
      <div className="sas_scripts_component">
        <div className="panel-heading">
          <span className="x" onClick={this.closePopovers}>
            <i className="fa fa-times"></i>
          </span>
          <h3 className="panel-title">
            <img src="com-sabre-example-redapp-web-module/assets/sas-logo-midnight.png" />
          </h3>
        </div>
        <div className="row">
          <div className="navLeft">
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
            </ul>
          </div>
          <div className="tab-content">
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
                  . It's basically a ul li group in html with a special class
                  that bootstrap translates into this cool formatting.
                </li>
              </ul>
            </div>
            <div className="tab-pane" id="hotel">
              <h3>Hotel Stuff</h3>
              <p>
                Something about hotels goes here. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Obcaecati fugiat architecto magni
                placeat. Tempora atque id officiis voluptatum, optio, vel
                adipisci voluptates placeat alias quis quo? Rerum sunt mollitia
                neque.
              </p>
            </div>
            <div className="tab-pane" id="car">
              <h3>Car Stuff</h3>
              <p>Something about hotels goes here.</p>
            </div>
            <div className="tab-pane" id="qc">
              <h3>QC Stuff</h3>
              <p>Something about hotels goes here.</p>
            </div>
          </div>
        </div>
        <div className="buttons-container">
          <div className="right-buttons">
            <button
              type="submit"
              className="search-button js_form-submit btn btn-success"
              onClick={this.closePopovers}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
