import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { AbstractViewOptions } from "sabre-ngv-app/app/AbstractViewOptions";
import { PersistModel } from "../models/PersistModel";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";

@Template("com-sabre-example-redapp-web-module:ReduxView")
export class ReduxView extends AbstractView<PersistModel> {
  constructor(options?: AbstractViewOptions) {
    super(options);
    super.addDomEvents({
      "keyup .change-message-ra": "_saveVal",
    });
  }

  _saveVal(event: JQueryEventObject) {
    const x: string = super.$(".brand-input").val();
    super.getModel().setHeaderText(x);
  }
}
