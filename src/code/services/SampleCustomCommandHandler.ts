import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";
import { CustomCommandHandler } from "sabre-ngv-customCommand/interfaces/CustomCommandHandler";
import { CustomCommandRq } from "sabre-ngv-customCommand/domain/CustomCommandRq";
import { CustomCommandRs } from "sabre-ngv-customCommand/domain/CustomCommandRs";
import { getService } from "../Context";
import { MyHelloModalWindow } from "../views/MyHelloModalWindow";
import { BasicModel } from "../models/BasicModel";
import { LayerService } from "sabre-ngv-core/services/LayerService";

export class SampleCustomCommandHandler extends CustomCommandHandler {

    static SERVICE_NAME =
    "com-sabre-example-redapp-web-module-service";

  onCommandSend(rq: CustomCommandRq) : Promise<CustomCommandRs> {

    return new Promise<CustomCommandRs>((resolve, reject) => {

      let addRemarkModalOptions = {
        title: 'Modal with handlebar template',
        actions: [{
          className: 'app.common.views.Button',
          caption: 'Submit',
          actionName: 'submit',
          type: 'secondary'
        }]
      };

      getService(LayerService).showInModal(
          new MyHelloModalWindow({model: new BasicModel(resolve)}), addRemarkModalOptions, {display: 'areaView'}
      );
    });

  }
}
