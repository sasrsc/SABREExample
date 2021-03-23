import AbstractBootstrapPopoverButton from "sabre-ngv-UIComponents/commandHelperButton/components/AbstractBootstrapPopoverButton";
import { ChildComponentContent } from "sabre-ngv-UIComponents/commandHelperButton/interfaces/ChildComponentContent";
import StatelessComponent from "sabre-ngv-UIComponents/baseComponent/components/StatelessComponent";

import { AbstractViewOptions } from "sabre-ngv-app/app/AbstractViewOptions";
import { SASMainComponents } from "./SASMainComponents";

import { Initial } from "sabre-ngv-core/decorators/classes/Initial";

@Initial({
  caption: '<i class="fa fa-sitemap"></i><span>SAS</span>',
  type: "default",
})
export default class SASMainPopover extends AbstractBootstrapPopoverButton {
  initialize(options: AbstractViewOptions): void {
    super.initialize(options);
  }

  private content = new StatelessComponent({
    componentName: "SASMainPopover",
    rootReactComponent: SASMainComponents,
  });

  protected getContent(): ChildComponentContent {
    return this.content;
  }
}
