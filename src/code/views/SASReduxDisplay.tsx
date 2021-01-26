import * as React from "react";

import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { Data } from "../services/LocalStore";
import { connect } from "react-redux";
import { getService } from "../Context";
import { LocalStoreHelperService } from "../services/LocalStoreHelperService";
import { Alert, Panel } from "react-bootstrap";

const eventBus: AbstractModel = new AbstractModel();

export interface OwnState {
  someText: string;
}

export class SASReduxDisplay extends React.Component<
  { messageFromStore },
  OwnState
> {
  state: OwnState = {
    someText: "Component state",
  };

  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  render(): JSX.Element {
    return (
      <div className="com-sabre-redapp-example3-web-command-message-web-module">
        <Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3"> Message from Redux</Panel.Title>
          </Panel.Heading>
          <Panel.Body>{this.props.messageFromStore}</Panel.Body>
        </Panel>
        <Alert bsStyle="warning">Change value using workflows modal</Alert>
      </div>
    );
  }
}

const mapStateToProps = (state: Data): { messageFromStore } => {
  //   const currentMessageName = getService(
  //     LocalStoreHelperService
  //   ).getCurrentMessageName();

  return {
    messageFromStore: `hello from message`,
  };
};

export const SASReduxDisplayWithStore = connect<{ messageFromStore }, {}, {}>(
  mapStateToProps
)(SASReduxDisplay);
