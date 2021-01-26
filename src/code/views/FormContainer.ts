import StatefulComponent from "sabre-ngv-UIComponents/baseComponent/components/StatefulComponent";
import { Data, LocalStore } from "../services/LocalStore";
import { Store } from "redux";

export class FormContainer extends StatefulComponent {
  store: Store<Data>;

  constructor(options, store) {
    super(options);
    this.store = store;
    console.log("Creating form container: ", options, store);
  }

  protected createStore(): Store<Data> {
    return this.store;
  }
}
