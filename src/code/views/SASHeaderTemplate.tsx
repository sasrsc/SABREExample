import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { context } from "../Context";
const eventBus: AbstractModel = new AbstractModel();

export class SASHeaderTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.closePopovers = this.closePopovers.bind(this);
    let moduleBaseUrl = context.getModule().getManifest().url;
    let assetsBaseUrl = `${moduleBaseUrl}/assets`;
    let exampleImgUrl = `${assetsBaseUrl}/saslogomidnight.png`;
  }

  closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  render(): JSX.Element {
    return (
      <header>
        <h3>
          <img src="com-sabre-example-redapp-web-module/assets/saslogomidnight.png" />
          {/* <img src="{this.exampleImgUrl}" /> */}
        </h3>
        <span onClick={this.closePopovers}>
          <i className="fa fa-times"></i>
        </span>
      </header>
    );
  }
}
