import * as React from "react";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { getService } from "../../Context";
import { CommFoundHelper } from "../../services/CommFoundHelper";
import { LayerService } from "sabre-ngv-core/services/LayerService";
// import { NudgeView } from "../../popUps/NudgeView";
// import { ShellPnrComponent } from "../../customWF/ShellPnrComponent";

// custom forms used by this popover
import { IntroPopover } from "./IntroPopover";
import { HotelPassivePopover } from "./HotelPassivePopover";
import { QueuePrefPopover } from "./QueuePrefPopover";
import { ProfilePopover } from "./ProfilePopover";
import { PassportDocumentationPopover } from "./PassportDocumentationPopover";
import { CstErrorForm } from "../cmdHelper/custom/CstErrorForm";

const eventBus: AbstractModel = new AbstractModel();
export enum availableForms {
  intro,
  passportDocumentation,
  hotelPassive,
  queuePref,
  profiles,
}

export interface ComponentsFoundState {
  currentView: availableForms;
}

export class SASMainComponents extends React.Component<
  {},
  ComponentsFoundState
> {
  constructor(props) {
    super(props);
  }

  state: ComponentsFoundState = {
    // set default form
    currentView: availableForms.intro,
  };

  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  private handleFormChange = (selectedView: availableForms) => (): void => {
    this.setState({
      currentView: selectedView,
    });
  };

  renderForm(): JSX.Element {
    switch (this.state.currentView) {
      case availableForms.intro:
        return (
          <IntroPopover
            handleClose={this.closePopovers}
            navigation={this.renderNavigation()}
          />
        );
      case availableForms.passportDocumentation:
        return (
          <PassportDocumentationPopover
            handleClose={this.closePopovers}
            navigation={this.renderNavigation()}
          />
        );
      case availableForms.hotelPassive:
        return (
          <HotelPassivePopover
            handleClose={this.closePopovers}
            navigation={this.renderNavigation()}
          />
        );
      case availableForms.queuePref:
        return (
          <QueuePrefPopover
            handleClose={this.closePopovers}
            navigation={this.renderNavigation()}
          />
        );
      case availableForms.profiles:
        return (
          <ProfilePopover
            handleClose={this.closePopovers}
            navigation={this.renderNavigation()}
          />
        );

      default:
        return <CstErrorForm errorData="no form to display" />;
    }
  }

  renderNavigation(): JSX.Element {
    return (
      <div className="navigation">
        <ul className="nav nav-pills tabs-left">
          <li
            className={
              this.state.currentView == availableForms.intro
                ? "active"
                : "xp-context"
            }
          >
            <a
              href="#"
              className="tab"
              onClick={this.handleFormChange(availableForms.intro)}
            >
              <span className="fa fa-book"></span>
            </a>
          </li>
          <li
            className={
              this.state.currentView == availableForms.hotelPassive
                ? "active"
                : "xp-context"
            }
          >
            <a
              href="#"
              className="tab"
              onClick={this.handleFormChange(availableForms.hotelPassive)}
            >
              <span className="fa fa-bed"></span>
            </a>
          </li>
          <li
            className={
              this.state.currentView == availableForms.passportDocumentation
                ? "active"
                : "xp-context"
            }
          >
            <a
              href="#"
              className="tab"
              onClick={this.handleFormChange(
                availableForms.passportDocumentation
              )}
            >
              <span className="fa fa-passport"></span>
            </a>
          </li>
          <li
            className={
              this.state.currentView == availableForms.queuePref
                ? "active"
                : "xp-context"
            }
          >
            <a
              href="#"
              className="tab"
              onClick={this.handleFormChange(availableForms.queuePref)}
            >
              <span className="fa fa-list-ol"></span>
            </a>
          </li>

          <li
            className={
              this.state.currentView == availableForms.profiles
                ? "active"
                : "xp-context"
            }
          >
            <a
              href="#"
              className="tab"
              onClick={this.handleFormChange(availableForms.profiles)}
            >
              <span className="fa fa-users"></span>
            </a>
          </li>
        </ul>
      </div>
    );
  }

  render(): JSX.Element {
    return this.renderForm();
  }
}
