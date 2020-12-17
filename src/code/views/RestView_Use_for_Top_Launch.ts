import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {AuthTokenType} from "sabre-ngv-app/app/services/impl/AuthTokenType";
import {HttpMethod} from "sabre-ngv-app/app/services/impl/HttpMethod";
import {RestModel} from "../models/RestModel";

@Template('com-sabre-example-redapp-web-module:RestView')
export class RestView extends AbstractView<RestModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }

    selfSubmitRestRequestAction(): void {

        const url: string = this.$('.url-field').find('.url').val();
        const httpMethod: HttpMethod = this.$('.httpMethod-field').find('.httpMethod').val();
        const authTokenType: AuthTokenType = this.$('.authTokenType-field').find('.authTokenType').val();
        const payload: string = this.$('.payload-field').find('.payload').val();
        const headers: string = this.$('.headers-field').find('.headers').val();

        this.$('.response').val("");


        this.getModel().sendRestRequest(
            url,
            httpMethod,
            authTokenType,
            payload,
            headers
        )
            .then((response) => {
                console.log(response.status, response.body);
                this.$('.response').val(JSON.stringify(response));
            })
            .catch((error) => {
                console.log(error.status, error.body);
                this.$('.response').val(JSON.stringify(error));
            })
    }
}
