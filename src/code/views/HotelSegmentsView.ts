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
import { ICommandMessageService } from "sabre-ngv-commsg/services/ICommandMessageService";
import {
  CommandMessageBasicRs,
  CommandMessageRq,
} from "sabre-ngv-pos-cdm/commsg";
import { LayerService } from "sabre-ngv-core/services/LayerService";
import { StatusView } from "./StatusView";
import { NativeSabreCommand } from "../services/NativeSabreCommand";
import {
  CommandMessageReservationRs,
  ReservationRs,
} from "sabre-ngv-pos-cdm/reservation";

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

  initialize(options: AbstractActionOptions) {
    super.initialize(options);
    this.addDomEvents({
      "change #hotelsList ": "getSpecificHotel",
    });
  }

  getSelectedHotel(): number {
    return this.selectedHotel;
  }

  private getSpecificHotel(): void {
    console.log("Hotel has been changed");
    // which hotel
    let thisHotel: number = this.$("#hotelsList").val();
    console.log("Hotel segment selected Id=" + thisHotel);

    //console.log(this.model);
    let hotels2 = this.getModel().get("hotels");
    // create empty var awaiting the hotel
    let foundHotel;

    //console.log("Hotel Count=" + hotels2.hotels.length);

    for (var i = 0; i < hotels2.hotels.length; i++) {
      var x = hotels2.hotels[i];
      console.log("Looping thru " + x.Id + " checking for " + thisHotel);
      if (x.Id == thisHotel) {
        console.log("Match on " + x.HotelInformation.Name);
        foundHotel = hotels2.hotels[i];
        break;
      }
    }
    console.log(foundHotel);
    var checkin = foundHotel.ReservationDetails.CheckIn.substring(0, 10);
    var checkout = foundHotel.ReservationDetails.CheckOut.substring(0, 10);

    // now prepopulate the form...
    $("#HotelName").val(foundHotel.HotelInformation.Name);
    $("#HotelChainCode").val(foundHotel.HotelInformation.ChainCode);
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
    console.log("Clicked on Modal footer submit (not a form submit)");

    let showRequest: true;
    let showResponse: true;

    // form the GK entry
    //       0HHTAAGK1DFWIN27JUL-OUT2AUG/HI AIRPORT WEST/SGLB/75.00/SI-@5827 OCEAN DRIVE¥MIAMI FL 38834¥PHONE305-
    // 555-1111@RQNEAR POOL/CF89732901
    let citycode: string = "RDU";
    let htlchain: string = "ES";
    let htlname: string = "EMBASSY SUITES CARY";
    let addr1: string = "201 HARRISON AVE";
    let addr2: string = "CARY NC 27513";
    let fone: string = "919-999-9999";
    let checkIn: string = "27JAN";
    let checkOut: string = "28JAN";
    let comm: string = "CMN-NC";
    let fax: string = "919-666-6666";
    let propnum: string = "37673";
    //let checkIn: string = this.$('#ipCheckIn').val();
    //let checkOut: string = this.$('#ipCheckOut').val();
    let rmCount: string = this.$("#ipRoomCount").val();
    let rmType: string = this.$("#ipRoomType").val();
    let curr: string = this.$("#ipCurrency").val();
    let amount: string = this.$("#ipAmount").val();
    let cf: string = this.$("#ipConfirmationNumber").val();
    let cxl: string = this.$("#ipCancelPolicy").val();
    let si: string = this.$("#ipFreeText").val();
    let sellentry: string =
      "0HHT" +
      htlchain +
      "GK" +
      rmCount +
      citycode +
      "IN" +
      checkIn +
      "-OUT" +
      checkOut +
      "/" +
      htlchain +
      " " +
      htlname +
      "/" +
      rmType +
      "/" +
      amount +
      curr +
      "/G/" +
      comm +
      "/SI-¤" +
      addr1 +
      "¥" +
      addr2 +
      "¥" +
      "FONE " +
      fone +
      "¥" +
      "FAX " +
      fax +
      "/C-" +
      cxl +
      "*" +
      propnum +
      "/CF-" +
      cf;
    //let sellentry: string = '5TEST';

    console.log(sellentry);

    // now call handleSubmit
    getService(NativeSabreCommand).handleSubmit(sellentry);
    //this.handleSubmit(sellentry);
  }
}
