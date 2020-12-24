import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";

const eventBus: AbstractModel = new AbstractModel();

export class SASFooterTemplate extends React.Component {

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
       <footer>
          <button
            type="submit"
            className="search-button js_form-submit btn btn-success"
            onClick={this.closePopovers}
          >
            Close
          </button>
        </footer>
    );
  }

}
