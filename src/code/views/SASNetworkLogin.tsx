import * as React from "react";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
//import { availableForms } from "/cmdHelper/gdsData/CommFoundComponents";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { AutoComplete } from "../components/AutoComplete";
import { Form } from "../components/Form";
import { ModalForm } from "../components/ModalForm";
import { Button } from "../components/Button";
import { getService } from "../Context";
import { CommFoundHelper } from "../services/CommFoundHelper";
import { LayerService } from "sabre-ngv-core/services/LayerService";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import { Variables } from "../services/Variables";

const eventBus: AbstractModel = new AbstractModel();
export interface OwnProps {
  handleClose?: () => void;
  navigation?: JSX.Element;
}
export interface OwnState {
  username: string;
  password: string;
}
export class SASNetworkLogin extends React.Component<OwnProps, OwnState> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.getGlobalFiles = this.getGlobalFiles.bind(this);
    this.renderButtons = this.renderButtons.bind(this);
    this.closeLayer = this.closeLayer.bind(this);
  }

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  state: OwnState = {
    username: "",
    password: "",
  };
  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };
  closeLayer = (): void => {
    getService(LayerService).clearLayer(33);
  };

  handleChange(e): void {
    //console.log("handle change", e);
    var a = e.target.name;
    var v = e.target.value;
    this.setState({ [a]: v });
    //console.log("handle change", e, a, v, this.state);
  }
  getGlobalFiles(e): void {
    // set state for the global variable
    getService(Variables).setGlobal("username", this.state.username);
    getService(Variables).setGlobal("password", this.state.password);
    console.log(`OK, will try and get global variables`);

    this.cfHelper.getGlobalVariables();
    this.closeLayer();
  }

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="Cancel"
        handleClick={this.closeLayer}
      ></Button>,
      <Button
        name="btnExecute"
        type="primary"
        title="Execute"
        handleClick={this.getGlobalFiles}
      ></Button>,
    ];
  }

  render(): JSX.Element {
    return (
      <ModalForm
        name="modalF"
        title="SAS Network Login"
        buttons={this.renderButtons()}
        content={null}
      >
        <div className="form-group">
          <Input
            type="text"
            name="username"
            title="User Name"
            value={this.state.username}
            placeHolder="enter SAS username"
            handleChange={this.handleChange}
          />
          <Input
            type="password"
            name="password"
            title="Password"
            value={this.state.password}
            placeHolder="enter SAS password"
            handleChange={this.handleChange}
          />
        </div>
      </ModalForm>
    );
  }
}
