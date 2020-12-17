import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {CssClass} from "sabre-ngv-core/decorators/classes/view/CssClass";

@CssClass('com-sabre-example-redapp-web-module')
@Template('com-sabre-example-redapp-web-module:AirSegmentsView')
export class AirSegmentsView extends AbstractView<AbstractModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }
}

