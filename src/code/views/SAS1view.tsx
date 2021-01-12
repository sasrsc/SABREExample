import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
const eventBus: AbstractModel = new AbstractModel();
import { context } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { Alert } from "react-bootstrap";

export interface MyProps {
  closePopovers: () => void;
}

export interface MyState {
  command?: string;
  soccer?: string;
  firstName?: string;
  responseMessage?: string;
  lastName?: string;
  isError?: boolean;
  jsonData?: any;
  isLoading?: boolean;
  lastIndex?: number;
  filename?: string;
}

export class SAS1view extends React.Component<MyProps, MyState> {
  constructor(props: MyProps) {
    super(props);

    this.closePopovers = this.closePopovers.bind(this);
    this.state = {
      command: "5test",
      soccer: "Man City",
      responseMessage: "",
      jsonData: [],
      isLoading: false,
      isError: false,
      lastIndex: 0,
      firstName: "",
      lastName: "",
      filename: "jsonRefPoints.sas&action=getRefPoints&isActive=1",
    };
  }

  private closePopovers() {
    //console.log('We need to close this popover');
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: string = event.currentTarget.value;
    const name: string = event.currentTarget.name;
    console.log(`Changing ${name} to ${value}`);
    this.setState({
      [name]: value,
    });
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
    //this.props.closePopovers();
    console.log(`I clicked cancel ${event}`);
    this.closePopovers();
  };

  // get queue info

  render(): JSX.Element {
    return (
      <div className="tab-pane active" id="1">
        <h1>Content About #1</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perspiciatis
          consequatur fugit impedit minima error nam, in veritatis
          exercitationem, eos molestiae placeat atque suscipit distinctio ex
          rerum laboriosam totam. Voluptatum, dicta!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus,
          minus incidunt expedita, aliquam nam, saepe exercitationem deserunt
          recusandae nostrum commodi quas optio at voluptates. Nam magnam alias
          officia porro amet!
        </p>
      </div>
    );
  }
}
