import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {getService} from "../Context";
import {RestApiService} from "sabre-ngv-communication/services/RestApiService";
import {AuthTokenType} from "sabre-ngv-app/app/services/impl/AuthTokenType";
import {HttpMethod} from "sabre-ngv-app/app/services/impl/HttpMethod";
import {RestResponse} from "sabre-ngv-communication/interfaces/RestResponse";

export class RestModel extends AbstractModel {

    sendRestRequest(url, httpMethod, authTokenType, payload, headers): Promise<RestResponse> {
        return getService(RestApiService).send(
            {
                httpMethod: httpMethod,
                url: url,
                authTokenType: authTokenType,
                payload: payload,
                headers: headers
            }
        )
    }
}
