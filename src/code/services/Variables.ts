import { context, getService } from "../Context";
import { CommFoundHelper } from "./CommFoundHelper";
import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";

export class Variables extends AbstractService {
  static SERVICE_NAME = "com-sabre-example-redapp-web-module-service-variables";

  private jsContent = null;

  private jsGlobals = {
    costcenters: [
      {
        key: "1234",
        value: "Travel",
      },
      {
        key: "9999",
        value: "Sales",
      },
    ],
    message: "Hello World - About This",
    uploads: {},
  };

  getFromJson(path: string): any {
    if (_.isUndefined(this.jsContent) || _.isNull(this.jsContent)) {
      //read content from assest file
      let modUrl = context
        .getModule()
        .getManifest()
        .url.concat("/assets/jsDb.json");
      getService(CommFoundHelper)
        .sendExternalHttpRequest({
          httpMethod: "GET",
          url: modUrl,
        })
        .then((res) => {
          console.log("jsonDB", res);
          console.log("jsonDB", res.body);
          this.jsContent = res.body;
          return this.jsContent[path];
        });
    } else {
      return this.jsContent[path];
    }
  }

  getGlobal(key: string): any {
    return this.jsGlobals[key];
  }

  setGlobal(key: string, value) {
    this.jsGlobals[key] = value;
  }
}
