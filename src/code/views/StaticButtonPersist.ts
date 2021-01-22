// copy of persistence example but needed new name
import { CssClass } from "sabre-ngv-core/decorators/classes/view/CssClass";
import { Initial } from "sabre-ngv-core/decorators/classes/Initial";
import AbstractBootstrapPopoverButton from "sabre-ngv-UIComponents/commandHelperButton/components/AbstractBootstrapPopoverButton";
import { ChildComponentContent } from "sabre-ngv-UIComponents/commandHelperButton/interfaces/ChildComponentContent";

import { AbstractViewOptions } from "sabre-ngv-app/app/AbstractViewOptions";
import { SimpleTabControllerPersistComponentWithStore } from "./SimpleTabControllerPersistComponent";
import { FormContainer } from "./FormContainer";

@CssClass("com-sabre-example-redapp-web-module btn btn-default")
@Initial({
  caption:
    '<i class="fa fa-edit"></i> <span class="hidden-xs dn-x-hidden-0-8">Persistence Example</span>',
  type: "default",
})
export default class StaticButtonPersist extends AbstractBootstrapPopoverButton {
  options = {
    componentName: "CommandMessagePopover",
    rootReactComponent: SimpleTabControllerPersistComponentWithStore,
  };

  private content;

  constructor(store) {
    super();
    this.content = new FormContainer(this.options, store);
  }

  protected getContent(): ChildComponentContent {
    return this.content;
  }

  /**
   * Initialize Button
   */
  initialize(options: AbstractViewOptions): void {
    super.initialize(options);
  }
}
