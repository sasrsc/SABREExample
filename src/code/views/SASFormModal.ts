import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {CssClass} from "sabre-ngv-core/decorators/classes/view/CssClass";

@CssClass('com-sabre-example-redapp-web-module')
@Template('com-sabre-example-redapp-web-module:SASFormModal')
export class SASFormModal extends AbstractView<AbstractModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }

    selfSubmitModalAction(): void {
        console.log('The user clicked on submit');
    }

    // private handleSubmit = async (event): Promise<void> => {
    //     event && event.preventDefault();
    //     console.log('I clicked on submit on the SAS Modal window');
    // };

    // private handleCancel() {
    //     console.log("I clicked on cancel on the SAS Modal window");
    // };

}

