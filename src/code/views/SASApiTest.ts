import { CssClass } from "sabre-ngv-core/decorators/classes/view/CssClass";
import { Initial } from "sabre-ngv-core/decorators/classes/Initial";
import AbstractBootstrapPopoverButton from "sabre-ngv-UIComponents/commandHelperButton/components/AbstractBootstrapPopoverButton";
import { ChildComponentContent } from "sabre-ngv-UIComponents/commandHelperButton/interfaces/ChildComponentContent";
import StatelessComponent from "sabre-ngv-UIComponents/baseComponent/components/StatelessComponent";
import { AbstractViewOptions } from "sabre-ngv-app/app/AbstractViewOptions";
import { SASExternalApiTest } from "./SASExternalApiTest";

@CssClass("com-sabre-example-redapp-web-module-forms-service btn btn-default")
@Initial({
  caption:
    '<i class="fa fa-map"></i> <span class="hidden-xs dn-x-hidden-0-8">Sample API Test</span>',
  type: "default",
})
export default class SASApiTest extends AbstractBootstrapPopoverButton {
  private content = new StatelessComponent({
    componentName: "CommandMessagePopover",
    rootReactComponent: SASExternalApiTest,
  });

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
