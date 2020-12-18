import { getService } from "../Context";
import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { AbstractActionOptions } from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import { AuthTokenType } from "sabre-ngv-app/app/services/impl/AuthTokenType";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";
import { ISoapApiService } from "sabre-ngv-communication/interfaces/ISoapApiService";

@Template("com-sabre-example-redapp-web-module:GetResView")
export class GetResView extends AbstractView<AbstractModel> {
  initialize(options: AbstractActionOptions) {
    super.initialize(options);
  }

  selfSubmitModalAction(): void {
    let thisPNR: string = this.$("#ipPnr").val();
    console.log(thisPNR);

    const action: string = "GetReservationRQ";
    const authTokenType: AuthTokenType = "SESSION";
    const timeout: number = 5000;
    const payload: string =
      "<GetReservationRQ Version='1.19.0' xmlns='http://webservices.sabre.com/pnrbuilder/v1_19'><Locator>UUYMYU</Locator><RequestType>Stateful</RequestType><ReturnOptions><ViewName>FullWithOpenRes</ViewName><ResponseFormat>STL</ResponseFormat></ReturnOptions></GetReservationRQ>";

    this.$(".response").val("");

    const soapApi: ISoapApiService = getService(ISoapApiService);

    soapApi
      .callSws({
        action,
        payload,
        authTokenType,
        timeout,
      })
      .then((response) => {
        const responseValue = response.errorCode
          ? JSON.stringify(response, null, 2)
          : response.value;

        this.$(".response").val(responseValue);
        console.log(responseValue);
        //console.log(response);
        //<stl19:Passenger id="11" nameType="S" referenceNumber="SAS-6785-7206" nameId="01.01" nameAssocId="1" elementId="pnr-11.1">
        $(responseValue)
          .find("stl19\\:Passenger")
          .each(function () {
            var stmt = $(this).attr("referenceNumber");
            console.log(stmt);
          });
      })
      .catch((error) => {
        this.$(".response").val(error);
      });
  }
}
