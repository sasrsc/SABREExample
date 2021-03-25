import * as React from "react";
import { getService, context } from "../Context";
//import { availableForms, OwnState } from "./CommFoundComponents";
import { LayerService } from "sabre-ngv-core/services/LayerService";

export interface PopoverFormProps {
  name: string;
  title: string;
  content: JSX.Element;
  buttons: JSX.Element[];
  navigation?: JSX.Element;
}
export class PopoverFormSAS extends React.Component<PopoverFormProps, {}> {
  handleClose(): void {
    getService(LayerService).clearLayer(33);
  }

  render(): JSX.Element {
    let imgStyle =
      context.getModule().getManifest().url + "/assets/saslogomidnight.png";

    return (
      <div className="com-sabre-example-redapp-web-module">
        <div className="popover-wrapper">
          <header>
            <img src={imgStyle} />
            <h3>{this.props.title}</h3>
          </header>
          <aside>{this.props.navigation}</aside>
          <article>{this.props.children}</article>
          <footer>
            {/* <div className="action-buttons">{this.props.buttons}</div> */}
            {this.props.buttons}
          </footer>
        </div>
      </div>
    );
  }
}
