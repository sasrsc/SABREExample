import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { LayerService } from "sabre-ngv-core/services/LayerService";
const eventBus: AbstractModel = new AbstractModel();
import { SASFormModal } from "./SASFormModal";
import { ModalWithTabs } from "./ModalWithTabs";
//import { SASQueuePrefsRender } from "./SASQueuePrefsRender";

export class SASInfoQC extends React.Component {
  constructor(props) {
    super(props);
    this.closePopovers = this.closePopovers.bind(this);
  }

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  showSASQueuePrefsRender = (e) => {
    e.preventDefault();
    console.log("I clicked on opening a render window" + e);
    // const modalOptions = {
    //   title: "SAS Modal Window",
    //   actions: [
    //     {
    //       className: "app.common.views.Button",
    //       caption: "Cancel",
    //       actionName: "handleCancel",
    //       type: "secondary",
    //     },
    //     {
    //       className: "app.common.views.Button",
    //       caption: "Submit",
    //       actionName: "handleSubmit",
    //       type: "secondary",
    //     },
    //   ],
    // };
    // getService(LayerService).showInModal(
    //   new SASQueuePrefsRender(),
    //   { title: "SAS Modal" },
    //   { display: "areaView" }
    // );
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

  render(): JSX.Element {
    return (
      <div className="tab-pane" id="qc">
        <h3>QC Stuff</h3>
        <p>Something about QC goes here.</p>
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
      </div>
    );
  }
}
