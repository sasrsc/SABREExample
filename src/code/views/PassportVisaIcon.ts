import { CssClass } from "sabre-ngv-core/decorators/classes/view/CssClass";
import { Initial } from "sabre-ngv-core/decorators/classes/Initial";
import AbstractBootstrapPopoverButton from "sabre-ngv-UIComponents/commandHelperButton/components/AbstractBootstrapPopoverButton";
import { ChildComponentContent } from "sabre-ngv-UIComponents/commandHelperButton/interfaces/ChildComponentContent";
import StatelessComponent from "sabre-ngv-UIComponents/baseComponent/components/StatelessComponent";
import { AbstractViewOptions } from "sabre-ngv-app/app/AbstractViewOptions";
import { PassportVisaDoc } from "./PassportVisa";

@CssClass("com-sabre-example-redapp-web-module")
@Initial({
  caption:
    '<i class="fa fa-passport"></i> <span class="hidden-xs dn-x-hidden-0-8">Passport/Visa</span>',
  type: "default",
})
export default class PassportVisaIcon extends AbstractBootstrapPopoverButton {
  private content = new StatelessComponent({
    componentName: "CommandMessagePopover",
    rootReactComponent: PassportVisaDoc,
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
