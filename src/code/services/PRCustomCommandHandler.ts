import { CustomCommandHandler } from "sabre-ngv-customCommand/interfaces/CustomCommandHandler";
import { CustomCommandRq } from "sabre-ngv-customCommand/domain/CustomCommandRq";
import { CustomCommandRs } from "sabre-ngv-customCommand/domain/CustomCommandRs";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import { getService } from "../Context";
import { LocalStore } from "./LocalStore";

export class PRCustomCommandHandler extends CustomCommandHandler {
  localStore: LocalStore;

  static SERVICE_NAME =
    "com-sabre-example-redapp-web-module-PRCustomCommandHandler";

  onCommandSend(rq: CustomCommandRq): Promise<CustomCommandRs> {
    return new Promise<CustomCommandRs>((resolve, reject) => {
      const areaService: IAreaService = getService(IAreaService);

      areaService.showBanner(
        "Info",
        "Message from redux: " + this.localStore.getCurrentAreaMessage()
      );
      resolve();
    });
  }

  setLocalStore(store: LocalStore): void {
    this.localStore = store;
    console.log("Local store set to ", store);
  }
}
