import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";
import { AbstractActionOptions } from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { CssClass } from "sabre-ngv-core/decorators/classes/view/CssClass";
import {
  I18nService,
  ScopedTranslator,
} from "sabre-ngv-app/app/services/impl/I18nService";
import { getService } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";

@CssClass("com-sabre-example-redapp-web-module")
@Template("com-sabre-example-redapp-web-module:QueuePrefsView")
export class QueuePrefsView extends AbstractView<AbstractModel> {
  selfSubmitModalAction(): void {
    console.log("Clicked on QP");
    var qList = this.getModel().get("queues");
    console.log(qList);
    // can we add a isChecked property to the array?
    qList.queues.forEach((a) => {
      a.isChecked = false;
    });
    console.log(qList);

    console.log("queue for 2nd item in list=" + qList.queues[1].PrefNum);
    //console.log(qthis1);
    // which items are checked!!!!

    // queue place QPM/70/123#75/12#43/1
    let sabrentry: string = "QPM/" + "156" + "/" + qList.queues[1].PrefNum;
    var qthis = [];

    getService(NativeSabreCommand).handleSubmit(sabrentry);
  }
}
