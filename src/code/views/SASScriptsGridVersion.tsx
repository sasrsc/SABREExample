import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { SASHeaderTemplate } from "./SASHeaderTemplate";
import { SAS1view } from "./SAS1view";
import { SAS2view } from "./SAS2view";
import { SAS3view } from "./SAS3view";
const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
}

export class SASScriptsGridVersion extends React.Component<{}, OwnState> {
  private readonly formsService: IFormsService = getService<IFormsService>(
    IFormsService
  );

  state: OwnState = {
    showThis: true,
  };

  private closePopovers = (): void => {
    eventBus.triggerOnEventBus("hide-popovers", "novice-menu");
  };

  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("I clicked on submit for the SAS Form Extends");
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("I clicked on cancel for the SAS Scripts");
    event.preventDefault();
  };

  render(): JSX.Element {
    return (
      <div className="sas_scripts_grid_bs">
        <SASHeaderTemplate />
        <aside>
          <ul className="nav nav-tabs">
            <li className="active">
              <a href="#1" data-toggle="tab">
                <span className="fa fa-plane"></span>
              </a>
            </li>
            <li>
              <a href="#2" data-toggle="tab">
                <span className="fa fa-bed"></span>
              </a>
            </li>
            <li>
              <a href="#3" data-toggle="tab">
                <span className="fa fa-car"></span>
              </a>
            </li>
          </ul>
        </aside>
        <article>
          <SAS1view closePopovers={() => {}} />
          <SAS2view closePopovers={() => {}} />
          <SAS3view closePopovers={() => {}} />
        </article>
      </div>
    );
  }
}
