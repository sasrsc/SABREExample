import * as React from "react";
import { Button } from "../../components/Button";
import { Checkbox } from "../../components/Checkbox";
import { Input } from "../../components/Input";
import { Payload } from "../../components/Payload";
import { PopoverForm } from "../../components/PopoverForm";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";

import {
  Alert,
  Button as BtnBs,
  FormGroup,
  FormControl,
} from "react-bootstrap";

export interface CommandServicePopoverProps {
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export interface CommandServicePopoverState {
  formatToExecute: string;
  showRq: boolean;
  showRs: boolean;
  cmdResponse: any;
  profile: string;
  response: string;
  profileType: string;
  profileResponse: any;
}
export class ProfilePopover extends React.Component<
  CommandServicePopoverProps,
  CommandServicePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
  }

  state: CommandServicePopoverState = {
    formatToExecute: "",
    showRq: true,
    showRs: true,
    cmdResponse: null,
    profile: "3466",
    response: "",
    profileType: "TVL",
    profileResponse: {},
  };

  cfHelper: CommFoundHelper = getService(CommFoundHelper);

  handleChange(e): void {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleCheck(e): void {
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }
  handleExecute(): void {
    let profileNum = this.cfHelper.getXmlPayload("GetProfile", {
      Profile: this.state.profile,
      Type: this.state.profileType,
    });
    console.log(profileNum);

    getService(CommFoundHelper)
      .sendSWSRequest({
        action: "EPS_EXT_ProfileToPNRRQ",
        payload: profileNum,
        authTokenType: "SESSION",
      })
      .then((res) => {
        this.setState({
          response: res.errorCode ? JSON.stringify(res, null, 2) : res.value,
        });
        getService(CommFoundHelper).refreshTipSummary();

        if (res.errorCode !== undefined && res.errorCode !== null) {
          getService(IAreaService).showBanner(
            "Error",
            "Failed: ".concat(res.errorCode),
            "Profile Move"
          );
        } else {
          getService(IAreaService).showBanner(
            "Success",
            `${this.state.profile} Added`,
            "Profile Move"
          );
        }

        this.props.handleClose();
      });
  }

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="Close"
        handleClick={this.props.handleClose}
      />,
      <Button
        name="btnExecute"
        type="primary"
        title="Execute"
        handleClick={this.handleExecute}
      />,
    ];
  }

  render(): JSX.Element {
    return (
      <>
        <PopoverForm
          name=""
          title="Profiles Testing"
          content={null}
          buttons={this.renderButtons()}
          navigation={this.props.navigation}
        >
          <p>Profile Testing....</p>
          <FormControl
            type="text"
            name="profile"
            value={this.state.profile}
            placeholder="Profile"
            onChange={this.handleChange}
          />
          <FormControl
            type="text"
            name="profileType"
            value={this.state.profileType}
            placeholder="Profile Type"
            onChange={this.handleChange}
          />
        </PopoverForm>
      </>
    );
  }
}
