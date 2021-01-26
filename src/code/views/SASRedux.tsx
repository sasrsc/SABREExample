import * as React from "react";
import { getService } from "../Context";
import { PersistModel } from "../models/PersistModel";
import { Initial } from "sabre-ngv-core/decorators/classes/Initial";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { AbstractModelOptions } from "sabre-ngv-app/app/AbstractModelOptions";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { LayerService } from "sabre-ngv-core/services/LayerService";
const eventBus: AbstractModel = new AbstractModel();
import { SASFormModal } from "./SASFormModal";
import { ModalWithTabs } from "./ModalWithTabs";
import { Data, LocalStore } from "../services/LocalStore";
import { LocalStoreHelperService } from "../services/LocalStoreHelperService";
import { connect } from "react-redux";

import {
  Modal,
  Alert,
  Panel,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  ButtonToolbar,
} from "react-bootstrap";

export interface MyState {
  show: boolean;
  comment: string;
  someText: string;
}

export class SASRedux extends React.Component<{}, MyState> {
  text: string;
  localStore: LocalStore;

  constructor(localStore: LocalStore) {
    super(localStore);
    this.localStore = localStore;
    //console.log("Store state during initialization:", localStore.store);
    this.handleChange = this.handleChange.bind(this);
    this.sendToStore = this.sendToStore.bind(this);
    this.state = {
      show: false,
      comment: "Can you see me?",
      someText: "Component state",
    };
    //this.text = localStore.getCurrentAreaMessage();

    this.closePopovers = this.closePopovers.bind(this);
  }

  handleChange(e) {
    this.setState({ someText: e.target.value });
  }

  sendToStore() {
    console.log(`I clicked send to store someText=${this.state.someText}`);

    //   this.localStore.setMessage(this.state.someText);
    console.log(this.localStore);

    //this.localStore.setText(this.state.someText);
  }

  getValidationState() {
    const length = this.state.someText.length;
    if (length > 10) return "success";
    if (length > 5) return "warning";
    if (length > 0) return "error";
    return null;
  }

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  showopenSasFormModal = (e) => {
    e.preventDefault();
    console.log("The link was clicked.");
    // close popover

    // Hide popovers before open modal
    this.closePopovers();

    // something here for the form
    console.log("I will open a new SAS Modal window");
    const modalOptions = {
      title: "SAS Modal Window",
      actions: [
        {
          className: "app.common.views.Button",
          caption: "Cancel",
          actionName: "handleCancel",
          type: "secondary",
        },
        {
          className: "app.common.views.Button",
          caption: "Submit",
          actionName: "handleSubmit",
          type: "secondary",
        },
      ],
    };

    getService(LayerService).showInModal(
      new SASFormModal(),
      { title: "SAS Modal" },
      { display: "areaView" }
    );
  };

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="redux">
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Redux/LocalStore</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <FormGroup
              controlId="formBasicText"
              validationState={this.getValidationState()}
            >
              <ControlLabel>Working example with validation</ControlLabel>
              <FormControl
                type="text"
                value={this.state.someText}
                placeholder="Enter text"
                onChange={this.handleChange}
              />
              <FormControl.Feedback />
              <HelpBlock>Validation is based on string length.</HelpBlock>
            </FormGroup>
            <ButtonToolbar>
              <Button onClick={this.sendToStore}>Send to LocalStore</Button>
            </ButtonToolbar>

            <p>
              {" "}
              <a href="#" onClick={this.showopenSasFormModal}>
                Redux Display Window
              </a>
            </p>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}
