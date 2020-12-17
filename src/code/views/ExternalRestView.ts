import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {HttpMethod} from "sabre-ngv-app/app/services/impl/HttpMethod";
import {getService} from "../Context";
import {RestApiService} from "sabre-ngv-communication/services/RestApiService";

@Template('com-sabre-example-redapp-web-module:ExternalRestView')
export class ExternalRestView extends AbstractView<AbstractModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }

    selfSubmitRestRequestAction(): void {

        const url: string = this.$('.url-field').find('.url').val();
        const httpMethod: HttpMethod = this.$('.httpMethod-field').find('.httpMethod').val();
        const payload: string = this.$('.payload-field').find('.payload').val();
        const headers: string = this.$('.headers-field').find('.headers').val();

        this.$('.response').val("");

        const resProm = getService(RestApiService).sendExternal({
            httpMethod: httpMethod,
            url: url,
            payload: payload,
            headers: headers
        });
        
        resProm.then((response) => {
                this.$('.response').val(JSON.stringify(response));
            })
            .catch((error) => {
                this.$('.response').val(JSON.stringify(error));
            })

    }
}
