import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { SASHeaderTemplate } from "./SASHeaderTemplate";
import { SASFooterTemplate } from "./SASFooterTemplate";
import { SASInfoQC } from "./SASInfoQC";
const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
}

export class SASScriptsGridVersion2 extends React.Component<{}, OwnState> {
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
    console.log("I clicked on submit");
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("I clicked on cancel");
    event.preventDefault();
  };

  render(): JSX.Element {
    return (
      <div className="sas_scripts_grid">
        <SASHeaderTemplate />
        <article>
          <p>Work on the Queue UI</p>
        </article>
        <SASFooterTemplate />        
      </div>
    );
  }
}
