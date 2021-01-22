import * as React from "react";
import { getService } from "../Context";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { IFormsService } from "sabre-ngv-forms/services/IFormsService";
import { SASHeaderTemplateContext } from "./SASHeaderTemplateContext";
import { SAS1view } from "./SAS1view";
import { SAS2view } from "./SAS2view";
import { SAS3view } from "./SAS3view";
const eventBus: AbstractModel = new AbstractModel();

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  showThis: boolean;
  headerText: string;
}

export class SASScriptsGridVersion extends React.Component<{}, OwnState> {
  private readonly formsService: IFormsService = getService<IFormsService>(
    IFormsService
  );

  state: OwnState = {
    showThis: true,
    headerText: "Default Value",
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

  private handleClick = (txt: string) => (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({
      headerText: txt,
    });
  };

  render(): JSX.Element {
    return (
      <div className="sas_scripts_grid_bs">
        <SASHeaderTemplateContext headertext={this.state.headerText} />
        <aside>
          <ul className="nav nav-tabs">
            <li className="active">
              <a
                href="#1"
                data-toggle="tab"
                onClick={this.handleClick("Plane Stuff")}
              >
                <span className="fa fa-plane"></span>
              </a>
            </li>
            <li>
              <a
                href="#2"
                data-toggle="tab"
                onClick={this.handleClick("Bed Stuff")}
              >
                <span className="fa fa-bed"></span>
              </a>
            </li>
            <li>
              <a
                href="#3"
                data-toggle="tab"
                onClick={this.handleClick("Square Stuff")}
              >
                <span className="fa fa-check-square"></span>
              </a>
            </li>
            <li>
              <a
                href="#4"
                data-toggle="tab"
                onClick={this.handleClick("Check Stuff")}
              >
                <span className="fa fa-check-square"></span>
              </a>
            </li>
            <li>
              <a
                href="#5"
                data-toggle="tab"
                onClick={this.handleClick("Some Other Stuff")}
              >
                <span className="fa fa-check-square"></span>
              </a>
            </li>
            <li>
              <a
                href="#6"
                data-toggle="tab"
                onClick={this.handleClick("Blah blah Stuff")}
              >
                <span className="fa fa-check-square"></span>
              </a>
            </li>
          </ul>
        </aside>
        <article>
          <SAS1view closePopovers={() => {}} />
          <SAS2view closePopovers={() => {}} />
          <SAS3view closePopovers={() => {}} />
          <div className="tab-pane" id="4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>{" "}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
          </div>
          <div className="tab-pane" id="5">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>{" "}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
          </div>
          <div className="tab-pane" id="6">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>{" "}
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus
              veritatis ducimus ipsum quidem praesentium. Excepturi illum
              explicabo non consectetur unde? Nihil perferendis veniam eveniet
              possimus fuga cumque illo necessitatibus quaerat.
            </p>
          </div>
        </article>
      </div>
    );
  }
}
