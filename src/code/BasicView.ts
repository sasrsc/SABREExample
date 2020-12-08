import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";

@Template("com-sabre-example-redapp-web-module:BasicView")

export class BasicView extends AbstractView<AbstractModel> {

}