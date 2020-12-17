import {AbstractView} from "sabre-ngv-app/app/AbstractView";
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {AbstractActionOptions} from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {CssClass} from "sabre-ngv-core/decorators/classes/view/CssClass";
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {getService} from '../Context';
import {ICommandMessageService} from 'sabre-ngv-commsg/services/ICommandMessageService';
import {CommandMessageBasicRs, CommandMessageRq} from 'sabre-ngv-pos-cdm/commsg';
import {LayerService} from 'sabre-ngv-core/services/LayerService';
import {StatusView} from './StatusView';
import {NativeSabreCommand} from '../services/NativeSabreCommand';

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator('com-sabre-example-redapp-web-module/translations');

export interface OwnState {
    command: string;
    showRequest: boolean;
    showResponse: boolean;
}

export interface OwnProps {
    closePopovers: () => void;
}

@CssClass('com-sabre-example-redapp-web-module')
@Template('com-sabre-example-redapp-web-module:HotelSegmentsView')

export class HotelSegmentsView extends AbstractView<AbstractModel> {

    initialize(options: AbstractActionOptions) {
        super.initialize(options);
        this.addDomEvents({​​​​
            'change #hotelsList ' : 'getSpecificHotel'
        }​​​​);
    }

    private getSpecificHotel() : void {
        console.log('Hotel has been changed');  
        //console.log(reservation);     
        // which hotel
        let thisHotel: number = this.$('#hotelsList').val();
        console.log('Hotel segment selected=' + thisHotel);
        console.log($('#hotelsList'));
        //let thisHotelDetails: string = Hotel.find(x => x.id === 'thisHotel');

        // prepopulate the form
        //let thisHotelInfo: string = $('#hotelsList').hotel[1];
        // create var for the selected hotel
        //$('#HotelName').val(#hotelsList.hotel[1].HotelInformation.Name);
        //$('#HotelName').val(thisHotelInfo.HotelInformation.Name);
        // convert 2020-12-17 to 17DEC

        // what api is sabre using 

        // 5#S[segment #] something - look in the remarks .. 


    }
    

    selfSubmitModalAction(): void {
        console.log("Clicked on Modal footer submit (not a form submit)");
    
        let showRequest: true;
        let showResponse: true;

        // form the GK entry
//       0HHTAAGK1DFWIN27JUL-OUT2AUG/HI AIRPORT WEST/SGLB/75.00/SI-@5827 OCEAN DRIVE¥MIAMI FL 38834¥PHONE305-
// 555-1111@RQNEAR POOL/CF89732901
        let citycode: string = 'RDU';
        let htlchain: string = 'ES';
        let htlname: string = 'EMBASSY SUITES CARY';
        let addr1: string = '201 HARRISON AVE';
        let addr2: string = 'CARY NC 27513';
        let fone: string = '919-999-9999';
        let checkIn: string = '27JAN';
        let checkOut: string = '28JAN';
        let comm: string = 'CMN-NC';
        let fax: string = '919-666-6666';
        let propnum: string = '37673';
        //let checkIn: string = this.$('#ipCheckIn').val();
        //let checkOut: string = this.$('#ipCheckOut').val();
        let rmCount: string = this.$('#ipRoomCount').val();
        let rmType: string = this.$('#ipRoomType').val();
        let curr: string = this.$('#ipCurrency').val();
        let amount: string = this.$('#ipAmount').val();
        let cf: string = this.$('#ipConfirmationNumber').val();
        let cxl: string=this.$('#ipCancelPolicy').val();
        let si: string=this.$('#ipFreeText').val();
        let sellentry: string = '0HHT' + htlchain + 'GK' + rmCount + citycode + 'IN' + checkIn + '-OUT' + checkOut + '/' + htlchain + ' ' + htlname + '/' + rmType + '/' + amount + curr + '/G/' + comm + '/SI-¤' + addr1 + '¥' + addr2 + '¥' + 'FONE ' + fone + '¥' + 'FAX ' + fax + '/C-' + cxl + '*' + propnum + '/CF-' + cf;
        //let sellentry: string = '5TEST';

        console.log(sellentry);
      

        // now call handleSubmit
        getService(NativeSabreCommand).handleSubmit(sellentry);
        //this.handleSubmit(sellentry);
        
    }
}

