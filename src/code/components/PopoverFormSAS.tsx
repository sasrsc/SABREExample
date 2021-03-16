import * as React from "react";
import { getService } from "../Context";
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
    return (
      <div className="com-sabre-example-redapp-web-module">
        <div className="popover-wrapper">
          <header>
            <img src="com-sabre-example-redapp-web-module/assets/saslogomidnight.png" />
            <h3>{this.props.title}</h3>
          </header>
          <aside>{this.props.navigation}</aside>
          <article>{this.props.children}</article>
          <footer>
            <div className="action-buttons">{this.props.buttons}</div>
          </footer>
        </div>
      </div>
    );
  }
}
