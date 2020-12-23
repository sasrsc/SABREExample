import * as React from "react";
import { getService } from "../Context";
import {
  I18nService,
  ScopedTranslator,
} from "sabre-ngv-app/app/services/impl/I18nService";

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator(
  "com-sabre-example-redapp-web-module/translations"
);

export interface OwnProps {
  closePopovers: () => void;
}

export interface OwnState {
  areaTextValue: string;
}

export class SASFormExtends extends React.Component<OwnProps, OwnState> {
  private handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    console.log("I clicked on submit for the SAS Form Extends");
    this.props.closePopovers();
  };

  private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
    console.log("I clicked on cancel for the SAS Form Extends");
    event.preventDefault();
    this.props.closePopovers();
  };

  render(): JSX.Element {
    return (
      <div className="com_sabre_example_redapp_web_module_forms_service">
        <div className="sample-form-container">
          <p>
            This is where the existing popover is extended and I can have a form
            or info here.
          </p>
          <form onSubmit={this.handleSubmit} ref="form">
            <div className="fields-container">
              {/**/}
              <div className="row">
                <div className="form-group col-md-4">
                  <label>Room type</label>
                  <input
                    type="text"
                    className="form-control"
                    id="{this.whatever}"
                    placeholder="ROH"
                  />
                </div>

                <div className="form-group col-md-4">
                  <label>Currency</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ipCurrency"
                    placeholder="USD"
                  />
                </div>
              </div>

              <div className="buttons-container">
                <div className="row">
                  <div className="right-buttons">
                    <button
                      className="cancel-button js_form-cancel btn btn-outline btn-success"
                      onClick={this.handleCancel}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="search-button js_form-submit btn btn-success"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
