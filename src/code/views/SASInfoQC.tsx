import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";

const eventBus: AbstractModel = new AbstractModel();

export class SASInfoQC extends React.Component {

  constructor(props) {
    super(props);
    this.closePopovers=this.closePopovers.bind(this);
  }

  closePopovers() {
    //console.log('We need to close this popover');    
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  render(): JSX.Element {
    return (      
       <div className="tab-pane" id="qc">
            <h3>QC Stuff</h3>
            <p>Something about QC goes here.</p>
        </div>
    );
  }

}
