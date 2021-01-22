//This is a copy from the persistence sample but had to rename as we were using this filename

import { Initial } from "sabre-ngv-core/decorators/classes/Initial";
import { AbstractModelOptions } from "sabre-ngv-app/app/AbstractModelOptions";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { Data, LocalStore } from "../services/LocalStore";

@Initial<AbstractModelOptions>({
  autoPropagateData: true,
})
export class PersistModel extends AbstractModel {
  text: string;
  localStore: LocalStore;

  constructor(localStore: LocalStore) {
    super();
    this.localStore = localStore;
    console.log(
      "Store state during initialization:",
      localStore.store.getState()
    );
    this.text = localStore.getCurrentAreaMessage();
  }

  getText(): string {
    return this.text;
  }

  setText(text: string): void {
    this.text = text;
    this.localStore.setMessage(text);
  }
}
