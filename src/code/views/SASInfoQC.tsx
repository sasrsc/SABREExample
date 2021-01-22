import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { LayerService } from "sabre-ngv-core/services/LayerService";
const eventBus: AbstractModel = new AbstractModel();
import { SASFormModal } from "./SASFormModal";
import { ModalWithTabs } from "./ModalWithTabs";
import { Data } from "../services/LocalStore";
import { LocalStoreHelperService } from "../services/LocalStoreHelperService";
import { connect } from "react-redux";
//import { SASQueuePrefsRender } from "./SASQueuePrefsRender";
import {
  Modal,
  Alert,
  Panel,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";

export interface MyState {
  show: boolean;
  comment: string;
  someText: string;
}
export class SASInfoQC extends React.Component<{}, MyState> {
  constructor(props = {}) {
    super(props);

    this.state = {
      show: false,
      comment: "Can you see me?",
      someText: "Component state",
    };

    this.closePopovers = this.closePopovers.bind(this);
    this.showSASModalWithRender = this.showSASModalWithRender.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
  }

  // state: MyState = {
  //   show: false,
  //   comment: "Can you see me?",
  //   someText: "Component state",
  // };

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  showSASQueuePrefsRender = (e) => {
    e.preventDefault();
    console.log("I clicked on opening a render window" + e);
  };

  showModalWithTabs = (e) => {
    e.preventDefault();
    console.log("The link was clicked.");
    // close popover

    // Hide popovers before open modal
    this.closePopovers();

    // something here for the form
    console.log("I will open a new SAS Modal window");

    getService(LayerService).showInModal(
      new ModalWithTabs(),
      { title: "Tab Example (Horizontal & Vertical)" },
      { display: "areaView" }
    );
  };

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

  showSASModalWithRender = (e) => {
    e.preventDefault();
    console.log("Let's open the Modal rendered with React.");
    // close popover
    this.closePopovers();
    this.setState({ show: true });
  };

  handleShow() {
    console.log(`changing state`);
    this.setState({ show: true });
  }

  handleClose() {
    this.setState({ show: false });
  }

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="qc">
        <p>This value comes from the LocalStore...</p>
        <p>Something about QC goes here.</p>
        <p>
          <a href="mailto:Richard.Clowes@sas.com?subject=goober">
            Mail Richard
          </a>
        </p>
        <p>
          Can I invoke a{" "}
          <a href="#" onClick={this.showopenSasFormModal}>
            modal window
          </a>
          ?
        </p>
        <p>
          Can I invoke a
          <a href="#" onClick={this.showSASQueuePrefsRender}>
            render window from here?
          </a>
          Not Yet...
        </p>
        <p>
          Link to
          <a
            href="https://fontawesome.com/icons?d=gallery&m=free"
            target="_blank"
          >
            font awesome icons
          </a>
          .
        </p>
        <p>
          Link to
          <a href="#" onClick={this.showModalWithTabs}>
            Modal window with horizontal and vertical tabs...
          </a>
          .
        </p>
        <p>
          Link to - current state = {this.state.show ? "true" : "false"}{" "}
          {this.state.comment}
          <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
            Launch modal
          </Button>
          .
        </p>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Text in a modal</h4>
            <p>
              <a href="mailto:Richard.Clowes@sas.com?subject=goober">
                Mail Richard
              </a>
            </p>

            <hr />

            <h4>Overflowing text to show scroll behavior</h4>
            <p>
              Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
              dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
              ac consectetur ac, vestibulum at eros.
            </p>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur
              et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
              auctor.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

// const mapStateToProps = (state: Data): { messageFromStore } => {
//   const currentMessageName = getService(
//     LocalStoreHelperService
//   ).getCurrentMessageName();

//   return {
//     messageFromStore: state[currentMessageName],
//   };
// };

// export const SASInfoQCWithStore = connect<{ messageFromStore }, {}, {}>(
//   mapStateToProps
// )(SASInfoQC);
