import { LocalStoreHelperService } from "./LocalStoreHelperService";
import { createStore } from "redux";
import { getService } from "../Context";

export interface Data {
  messageAreaA: string;
  messageAreaB: string;
  messageAreaC: string;
  messageAreaD: string;
  messageAreaE: string;
  messageAreaF: string;
  headerText: string;
  testValue: string;
}

const defaultState: Data = {
  messageAreaA: "Area A",
  messageAreaB: "Area B",
  messageAreaC: "Area C",
  messageAreaD: "Area D",
  messageAreaE: "Area E",
  messageAreaF: "Area F",
  headerText: "this is my header 2",
  testValue: "What is my value",
};

function reducer(state: Data = defaultState, action) {
  const newState = {};
  const currentMessageName = getService(
    LocalStoreHelperService
  ).getCurrentMessageName();
  newState[currentMessageName] = action.newVal;

  switch (action.type) {
    case "CHANGE_MSG":
      return {
        ...state,
        ...newState,
      };
    default:
      return state;
  }
}

export class LocalStore {
  public store = createStore(reducer);

  getData(): Data {
    return this.store.getState();
    //console.log(this.store);
  }

  getCurrentAreaMessage(): string {
    const currentMessageName = getService(
      LocalStoreHelperService
    ).getCurrentMessageName();

    return this.store.getState()[currentMessageName];
  }

  setMessage(newVal: string) {
    const action = { type: "CHANGE_MSG", newVal: newVal };
    this.store.dispatch(action);
  }

  setHeaderTextMessage(newVal: string) {
    const action = { type: "CHANGE_MSG", newVal: newVal };
    this.store.dispatch(action);
  }

  getHeaderTextValue(v): string {
    //const currentMessageName = "Hello my name is Jo";

    // then decided to pass in the variable to update as a parameter (v)
    const currentMessageName = v;
    //return currentMessageName;
    return this.store.getState()[currentMessageName];
  }
}
