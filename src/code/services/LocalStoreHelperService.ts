import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";
import { IAreaService } from "sabre-ngv-app/app/services/impl/IAreaService";
import { getService } from "../Context";

export class LocalStoreHelperService extends AbstractService {
  static SERVICE_NAME =
    "com-sabre-example-redapp-web-module-LocalStoreHelperService";

  getCurrentMessageName(): string {
    const areaService: IAreaService = getService(IAreaService);
    const currentArea = areaService.getActiveArea().toUpperCase();

    return `messageArea${currentArea}`;
  }
}
