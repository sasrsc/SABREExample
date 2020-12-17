import {getService} from "../Context";
import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {AuthTokenType} from "sabre-ngv-app/app/services/impl/AuthTokenType";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {ISoapApiService} from "sabre-ngv-communication/interfaces/ISoapApiService";

@Template('com-sabre-example-redapp-web-module:SoapView')
export class SoapView extends AbstractView<AbstractModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }

    selfSubmitModalAction(): void {

        const action: string = this.$('.action-field').find('.action').val();
        const authTokenType: AuthTokenType = this.$('.authTokenType-field').find('.authTokenType').val();
        const timeout: number = this.$('.timeout-field').find('.timeout').val();
        const payload: string = this.$('.payload-field').find('.payload').val();

        this.$('.response').val("");

        const soapApi: ISoapApiService = getService(ISoapApiService);

        soapApi.callSws({
            action,
            payload,
            authTokenType,
            timeout
        }).then((response) => {
            const responseValue =
                response.errorCode ? JSON.stringify(response, null, 2) : response.value;

            this.$('.response').val(responseValue);
        })
        .catch((error) => {
            this.$('.response').val(error);
        })
    }
}
