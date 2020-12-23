import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";
import { AbstractActionOptions } from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { CssClass } from "sabre-ngv-core/decorators/classes/view/CssClass";
import {
  I18nService,
  ScopedTranslator,
} from "sabre-ngv-app/app/services/impl/I18nService";
import { getService } from "../Context";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import { SASUtils } from "../services/SASUtils";

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator(
  "com-sabre-example-redapp-web-module/translations"
);

export interface OwnState {
  command: string;
  showRequest: boolean;
  showResponse: boolean;
}

export interface OwnProps {
  closePopovers: () => void;
}

@CssClass("com-sabre-example-redapp-web-module")
@Template("com-sabre-example-redapp-web-module:HotelSegmentsView")
export class HotelSegmentsView extends AbstractView<AbstractModel> {
  private selectedHotel = -1;
  private haddr1: string;
  private haddr2: string;
  private hname: string;
  private hchaincode: string;
  private hcitycode: string;
  private hfone: string;
  private hprop: string;

  initialize(options: AbstractActionOptions) {
    super.initialize(options);
    this.addDomEvents({
      "change #hotelsList ": "getSpecificHotel",
    });
  }

  private convertDate(d) {
    //console.log(`Converting ${d}`);
    // format is 2021-07-23
    var dd = d.substring(8, 10);
    let mm: number = parseInt(d.substring(5, 7)) - 1;
    //console.log(`dd=${dd} and mm=${mm}`);
    var mmm = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ][mm];

    var ddmmm = dd + mmm;
    //console.log(`Converted to ${ddmmm}`);
    return ddmmm;
  }

  getSelectedHotel(): number {
    return this.selectedHotel;
  }

  getSpecificHotel(): void {
    console.log("Hotel has been changed");
    // which hotel
    let thisHotel: number = this.$("#hotelsList").val();
    console.log("Hotel segment selected Id=" + thisHotel);

    //console.log(this.model);
    let hotels2 = this.getModel().get("hotels");
    console.log("The array=" + hotels2);
    // create empty var awaiting the hotel
    // this returns undefined - why?
    let foundHotel2: any = hotels2.hotels.find((h) => h.Id === thisHotel);
    console.log("3=" + foundHotel2);

    let foundHotel;

    // this returns undefined - why?
    foundHotel = hotels2.hotels.find((h) => h.Id === thisHotel);
    console.log("1=" + foundHotel);
    //console.log("Hotel Count=" + hotels2.hotels.length);
    //loop through the hotels and find the one where the Id value is thisHotel
    for (var i = 0; i < hotels2.hotels.length; i++) {
      var x = hotels2.hotels[i];
      console.log("Looping thru " + x.Id + " checking for " + thisHotel);
      if (x.Id == thisHotel) {
        console.log("Match on " + x.HotelInformation.Name);
        foundHotel = hotels2.hotels[i];
        break;
      }
    }
    // this is the hotel object for the chosen hotel
    //console.log(foundHotel);
    console.log("2=" + foundHotel);

    // now prepopulate the form...
    var checkin = foundHotel.ReservationDetails.CheckIn.substring(0, 10);
    var checkout = foundHotel.ReservationDetails.CheckOut.substring(0, 10);

    this.hname = foundHotel.HotelInformation.Name;
    this.hchaincode = foundHotel.HotelInformation.ChainCode;
    this.haddr1 = foundHotel.HotelInformation.Address.AddressLine[0];
    this.haddr2 = foundHotel.HotelInformation.Address.AddressLine[1];
    this.hcitycode = foundHotel.HotelInformation.Address.CityCode;
    this.hfone = foundHotel.HotelInformation.PhoneNumber;
    this.hprop = foundHotel.HotelInformation.SabreCode;
    $("#ipCheckIn").val(checkin);
    $("#ipCheckOut").val(checkout);
    $("#ipNights").val(foundHotel.ReservationDetails.Duration);
    $("#ipRoomCount").val(foundHotel.ReservationDetails.NumberOfUnits);
    $("#ipRoomType").val(foundHotel.ReservationDetails.RoomTypeCode);
    $("#ipCurrency").val(
      foundHotel.ReservationDetails.Rates.NightlyRate.Currency
    );
    $("#ipAmount").val(foundHotel.ReservationDetails.Rates.NightlyRate.Amount);
    $("#ipConfirmationNumber").val(foundHotel.ReservationDetails.Confirmation);
    $("#ipCancelPolicy").val(
      foundHotel.ReservationDetails.CancellationPolicy.PolicyCode
    );
    //$("#ipFreeText").val();
  }

  selfSubmitModalAction(): void {
    console.log(
      "Clicked on Modal footer submit (not a form submit)" + this.haddr1
    );
    //console.log(foundHotel);
    //you can reference the static elements of the found hotel by this.hxxxx as declared at the top of the class stmt
    let showRequest: true;
    let showResponse: true;

    // form the GK entry
    //       0HHTAAGK1DFWIN27JUL-OUT2AUG/HI AIRPORT WEST/SGLB/75.00/SI-@5827 OCEAN DRIVE¥MIAMI FL 38834¥PHONE305-
    // 555-1111@RQNEAR POOL/CF89732901
    let comm: string = $("#hotelsCommissionable").val();
    //let fax: string = "919-666-6666"; do we need fax?
    let ckIn: string = this.$("#ipCheckIn").val();
    let ckOut: string = this.$("#ipCheckOut").val();

    console.log(`START: Take form value checkin ${ckIn} and convert it `);
    var ckIn2 = this.convertDate(ckIn);
    //console.log(ckIn2);
    console.log(
      `END: Took form value checkin ${ckIn} and converted it to ${ckIn2}`
    );

    let ckIn3: string = SASUtils.convertDate(ckIn);
    console.log(ckIn3);

    //console.log(`Check In 3 = ${ckIn3}`);

    var ckOut2 = this.convertDate(ckOut);
    let rmCount: string = this.$("#ipRoomCount").val();
    let rmType: string = this.$("#ipRoomType").val();
    let curr: string = this.$("#ipCurrency").val();
    let amount: string = this.$("#ipAmount").val();
    let cf: string = this.$("#ipConfirmationNumber").val();
    let cxl: string = this.$("#ipCancelPolicy").val();
    let si: string = this.$("#ipFreeText").val();

    let sellentry: string =
      "0HHT" +
      this.hchaincode +
      "GK" +
      rmCount +
      this.hcitycode +
      "IN" +
      ckIn2 +
      "-OUT" +
      ckOut2 +
      "/" +
      this.hchaincode +
      " " +
      this.hname +
      "/" +
      rmType +
      "/" +
      amount +
      curr +
      "/G/" +
      comm +
      "/SI-¤" +
      this.haddr1 +
      "¥" +
      this.haddr2 +
      "¥" +
      "FONE " +
      this.hfone +
      "/C-" +
      cxl +
      "*" +
      this.hprop +
      "/CF-" +
      cf;
    //let sellentry: string = '5TEST';

    console.log(sellentry);

    // now call handleSubmit
    getService(NativeSabreCommand).handleSubmit(sellentry);
    //this.handleSubmit(sellentry);
  }
}
