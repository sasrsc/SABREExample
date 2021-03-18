import * as React from "react";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { InputGroup } from "../../components/InputGroup";
import { Payload } from "../../components/Payload";
import { PopoverFormSAS } from "../../components/PopoverFormSAS";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { XmlTools } from "../../util/XmlTools";

export interface TemplatePopoverProps {
  // keep these
  handleClose?: () => void;
  navigation?: JSX.Element;
}

export interface TemplatePopoverState {
  // just samples
  actionCode: string;
  payload: string;
  response: any;
  rsfilter: string;
  shouldParse: boolean;
}

export class TemplatePopover extends React.Component<
  TemplatePopoverProps,
  TemplatePopoverState
> {
  constructor(e) {
    super(e);
    this.handleChange = this.handleChange.bind(this);
    this.handleExecute = this.handleExecute.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  state: TemplatePopoverState = {
    // just samples
    actionCode: "",
    payload: "",
    response: "",
    rsfilter: "",
    shouldParse: false,
  };

  handleChange(e): void {
    // this handles someone changing an input text field
    this.setState({ [e.target.name]: e.target.value });
  }
  handleCheck(e): void {
    // this handles someone clicked on the checkbox
    this.setState({ [e.target.name]: !this.state[e.target.name] });
  }

  handleExecute(): void {
    console.log(`This is what happens when I hit submit`);
    // some code
    console.log(`Now close the window`);
    this.props.handleClose();
  }

  renderButtons(): JSX.Element[] {
    return [
      <Button
        name="btnCancel"
        type="cancel"
        title="Cancel"
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
      <PopoverFormSAS
        name=""
        title="My Title Goes Here"
        content={null}
        buttons={this.renderButtons()}
        navigation={this.props.navigation}
      >
        <p>This is where you type your content...</p>
        {/* this uses the input component in the \components directory */}
        <Input
          type="text"
          name="actionCode"
          title="Action Code"
          placeHolder="Something here..."
          value={this.state.actionCode}
          handleChange={this.handleChange}
        />
      </PopoverFormSAS>
    );
  }
}
