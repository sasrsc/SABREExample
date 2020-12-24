import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";

const eventBus: AbstractModel = new AbstractModel();

export class SASHeaderTemplate extends React.Component {

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
        <header>
          <h3><img src="com-sabre-example-redapp-web-module/assets/sas-logo-midnight.png" /></h3>
          <span onClick={this.closePopovers}><i className="fa fa-times"></i>      
          </span>
        </header>  
    );
  }

}
