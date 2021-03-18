import { context, getService } from "../Context";
import { CommFoundHelper } from "./CommFoundHelper";
import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";

export class Variables extends AbstractService {
  static SERVICE_NAME = "com-sabre-example-redapp-web-module-service-variables";

  private jsContent = null;

  private jsGlobals: any = {
    Costcenters: [],
    Projects: [],
    Groups: [],
    LodgingLimits: [],
    PreferredHotels: [],
    PrefNum: [],
    Agents: [],
    managers: [],
    message: "Hello World - About This",
    SASToken: {},
    uploads: [],
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
    // returns the global variable
    return this.jsGlobals[key];
  }

  setGlobal(key: string, value) {
    // sets the value of the global variable to whatever is passed...
    this.jsGlobals[key] = value;
  }

  appendGlobal(key: string, value) {
    // add item to the list
    console.log(`Adding for ${key}`);
    this.jsGlobals[key].push(value);
  }

  appendGlobalUniqueVar(key: string, value) {
    // remove the value if it exists
    this.jsGlobals[key] = this.jsGlobals[key].filter(
      (item) => item.filename !== value.filename
    );
    // add item to the list
    console.log(`Adding for ${key}`);
    this.jsGlobals[key].push(value);
  }
}
