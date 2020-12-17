import { Module } from 'sabre-ngv-core/modules/Module';
import { DtoService } from 'sabre-ngv-app/app/services/impl/DtoService';
import { getService } from './Context';
import { ExtensionPointService } from "sabre-ngv-xp/services/ExtensionPointService";
import { RedAppSidePanelConfig } from "sabre-ngv-xp/configs/RedAppSidePanelConfig";
import { WidgetXPConfig } from 'sabre-ngv-xp/configs/WidgetXPConfig';
import { RedAppSidePanelButton } from "sabre-ngv-redAppSidePanel/models/RedAppSidePanelButton";
import { LayerService } from "sabre-ngv-core/services/LayerService";
//import { BasicView } from './views/BasicView';
import { SasFormView } from './views/SasFormView';
import {MyPnr} from "./views/MyPnr";
import StaticButton from './views/StaticButton';
import {NudgeConfig} from 'sabre-ngv-xp/configs/NudgeConfig';
import {NgvNudgeEntry} from 'sabre-ngv-xp/interfaces/NgvNudgeEntry';
import {NudgeEntryView} from "./views/NudgeEntryView";
import { MyHelloModalWindow } from "./views/MyHelloModalWindow";
import { BasicModel } from "./models/BasicModel";
import { SampleCustomCommandHandler } from "./services/SampleCustomCommandHandler";
import {NativeSabreCommand} from './services/NativeSabreCommand';
import { registerService } from "./Context";
import {SoapView} from "./views/SoapView";
import {GetResView} from "./views/GetResView";
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import {RestView} from "./views/RestView_Use_for_Top_Launch";
import {ExternalRestView} from "./views/ExternalRestView";
import {RestModel} from "./models/RestModel";
import {IReservationService} from "sabre-ngv-reservation/services/IReservationService";
import {ReservationView} from "./views/ReservationView";
import {CommandMessageReservationRs, ReservationRs} from "sabre-ngv-pos-cdm/reservation";
import {AirSegmentsView} from "./views/AirSegmentsView";
import {HotelSegmentsView} from "./views/HotelSegmentsView";

export class Main extends Module {
    init(): void {
        super.init();

        // kb rc testing gitlab

        const xp = getService(ExtensionPointService);
    
        // used for nudge ...
        const CUSTOM_ICON_IN_BASE64: string = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJ0lEQVRYR83XsQ3CMBAFUG'
            + 'caRkqBWIGWJgUFDS0rIApGYht00lmyHPvu37cCoSEI7P+I7Ys9pT+/psH8Rdvf2H5GABJ+'
            + '1WB5pxAsIIcfFfBSTBjBAMrwtwLmlBKFiAJa4Xn4KUQEYIXTCBSAhFMIBGCFnzX1US1DeD'
            + 'g8gPfPnxp8atQBCGEBvHDJtADyvYvoAZBwBOAiWgA0HAWYiBoQCY8AuogSEA2PApqIDGDC'
            + 'GcAKsRuAyJi74C3DujysluWuJmHWRu7EXRtdnB1RtyCNFiJkJ2ZWw9FSfFDBpyOhSzE6HJ'
            + 's+jBDE5o9jBOEuNWuiePuBsi2yOtwxrzERgFeswuHSYRTQQ1DhLKBGyGfqTDACKBFy/fOj'
            + 'Wbk65Dp8JMsdMHMAKb/wb756N3sh+j5jAgAAAABJRU5ErkJggg==';

        xp.addConfig('nudge', new NudgeConfig(
            CUSTOM_ICON_IN_BASE64,
            'Redapp Web Nudge with action for AirAvailability',
            [{
                id: 'RedappActionId',
                label: 'Click me!',
                action: (entries: NgvNudgeEntry[]) => {
                    console.log('Entries for this nudge:');
                    console.log(entries);
                    getService(LayerService).showInModal(new NudgeEntryView({
                        model: {entries: {entries}}
                    }), {title: 'Nudge entries'}, {display: 'areaView'});
                }
            }],
            this.filterForNudge)
        );

        xp.addConfig('nudge', new NudgeConfig(
            CUSTOM_ICON_IN_BASE64,
            'Redapp Web Nudge without action for AirAvailability',
            [],
            this.filterForNudgeWithoutAction)
        );

        xp.addConfig('nudge', new NudgeConfig(
            CUSTOM_ICON_IN_BASE64,
            'Redapp Web Nudge for AirAvailability with many segments per trip',
            [],
            this.filterForNudgeWithManySegmentsPerTrip)
        );

        // initialize your module here
        console.log("Just added the Reservation sample to my redapp");

        // used for the right side panel

        const sidepanelConfig = new RedAppSidePanelConfig([
            new RedAppSidePanelButton("Show hello modal","", () => { this.showMyHelloModalWindow(); }),
            new RedAppSidePanelButton("VA Traveler Report","", () => { this.goToVaReport(); }),
            new RedAppSidePanelButton('REST', 'btn btn-secondary side-panel-button redapp-web-rest redapp-web-rest-internal', () => this.openModalWithRest()),
            new RedAppSidePanelButton('External REST', 'btn btn-secondary side-panel-button redapp-web-rest redapp-web-rest-external', () => this.openExternalModalWithRest()),
            new RedAppSidePanelButton('Add to PNR', 'btn btn-secondary side-panel-button redapp-web-addpnr', () => this.addToPnr()),
            new RedAppSidePanelButton('Open handlebar view', 'btn btn-secondary side-panel-button redapp-web-customCommand', () => this.showView()),
            new RedAppSidePanelButton('SOAP', 'btn btn-secondary side-panel-button redapp-web-soap', () => this.openModal()),
            new RedAppSidePanelButton('GetRes Using SOAP', 'btn btn-secondary side-panel-button redapp-web-soap', () => this.openGetResModal()),
            new RedAppSidePanelButton('Reservation', 'btn btn-secondary side-panel-button redapp-web-reservation', () => this.getReservation()),
            new RedAppSidePanelButton('Reservation Air Segments', 'btn btn-secondary side-panel-button redapp-web-reservation-air', () => this.getAirSegments()),
            new RedAppSidePanelButton('Reservation Hotels Segments', 'btn btn-secondary side-panel-button redapp-web-reservation-air', () => this.getHotelSegments())

        ]);

        //var reservation = {};

        registerService(SampleCustomCommandHandler);
        registerService(NativeSabreCommand);
        
        xp.addConfig("redAppSidePanel", sidepanelConfig);
  
        // used for the form
        const extensionPointService: ExtensionPointService = getService(ExtensionPointService);
        extensionPointService.addConfig('novice-buttons', new WidgetXPConfig(StaticButton, -1000));
        
        //used in the graphical pnr example
        //getService(ExtensionPointService).addConfig('novice-buttons', new WidgetXPConfig(StaticButton, -1000));
 
    }

    private getReservation(): void {
        console.log("Show reservation in modal");
        let reservationPromise: Promise<CommandMessageReservationRs> = getService(IReservationService).getReservation();
        reservationPromise.then(this.displayReservationModel.bind(this)).catch((error) => {
            console.log("Error while receiving reservation");
            console.log(error);
        });
    }

    private getAirSegments(): void {
        console.log("Show air segment in modal");
        let reservationPromise: Promise<CommandMessageReservationRs> = getService(IReservationService).getReservation();
        reservationPromise.then(this.displayAirSegment.bind(this)).catch((error) => {
            console.log("Error while receiving reservation");
            console.log(error);
        });
    }

    private getHotelSegments(): void {
        console.log("Show hotel segment in modal");
        let reservationPromise: Promise<CommandMessageReservationRs> = getService(IReservationService).getReservation();
        reservationPromise.then(this.displayHotelSegment.bind(this)).catch((error) => {
            console.log("Error while receiving reservation");
            console.log(error);
        });
    }

    private displayReservationModel(commandMessageReservationRs: CommandMessageReservationRs): void {
        var reservation = commandMessageReservationRs['Data'];
        console.log(reservation);
        this.sortPassengersById(reservation);
        this.sortRemarksByOrderNumber(reservation);
        getService(LayerService).showInModal(new ReservationView({
            model: {reservation: {reservation}}
        }), {title: "Reservation"}, {display: 'areaView'});
    }

    private displayAirSegment(commandMessageReservationRs: CommandMessageReservationRs): void {
        var reservation = commandMessageReservationRs['Data'];
        var air = reservation.Segments.AirSegments.Air[0];
        getService(LayerService).showInModal(new AirSegmentsView({
            model: {air: {air}}
        }), {title: "Air segments"}, {display: 'areaView'});
    }

    private isHotelId(hotels) {
        return hotels.Id == 4;
    }​​​​

    private myFunction2(hotel): void {​​
        let hotelfilter = hotel.findIndex(this.isHotelId);
        console.log(hotelfilter);
    }​​

    private isRemarkSegment(remark) {​​
        //return remark.Id <= 2;
        if (remark.SegmentAssociation && remark.SegmentAssociation.SegmentIds==4){​​
            console.log("true");
            return true;
        }​​ else {​​
            console.log("false");
            return false;
        }​​;        
    }​​

    private myFunction(reservation: ReservationRs) : void {​​
        console.log("I don't speak Spanish!");
        //console.log(reservation.Remarks.Remark[0].Id);
        let remarksfilter = reservation.Remarks.Remark.filter(this.isRemarkSegment);
        console.log("filter remarks")
        console.log(remarksfilter);
    }​​
    

    
    
    private displayHotelSegment(commandMessageReservationRs: CommandMessageReservationRs): void {
        var reservation = commandMessageReservationRs['Data'];
        console.log(reservation.Segments.HotelSegments);
        var hotel = reservation.Segments.HotelSegments.Hotel;
        console.log(hotel);
        this.myFunction2(hotel);
        this.myFunction(reservation);

        let restModalOptions = {
            title: 'Convert HK to Passive',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Change to Passive',
                actionName: 'submit-modal',
                type: 'success'
            }]
        };
        
        getService(LayerService).showInModal(new HotelSegmentsView({model: {hotel: {hotel}}}), restModalOptions, {display: 'areaView'});

    }


    private sortRemarksByOrderNumber(reservation: ReservationRs): void {
        if (reservation && reservation.Remarks && reservation.Remarks.Remark) {
            reservation.Remarks.Remark.sort(function (remark1, remark2) {
                return remark1.OrderNumber - remark2.OrderNumber;
            });
        }
    }

    private sortPassengersById(reservation: ReservationRs): void {
        if (reservation && reservation.Passengers && reservation.Passengers.Passenger) {
            reservation.Passengers.Passenger.sort(function(passenger1, passenger2) {
                return passenger1.Id - passenger2.Id;
            });
        }
    }

    private openModalWithRest(): void {

        let restModalOptions = {
            title: 'Rest API',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'submit-rest-request',
                type: 'secondary'
            }]
        };

        getService(LayerService).showInModal(
            new RestView({model: new RestModel()}),
            restModalOptions,
            {display: 'areaView'});
    }

    private openExternalModalWithRest(): void {

        let restModalOptions = {
            title: 'External Rest API',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'submit-rest-request',
                type: 'secondary'
            }]
        };

        getService(LayerService).showInModal(
            new ExternalRestView({model: new AbstractModel()}),
            restModalOptions,
            {display: 'areaView'});
    }

    // right hand side panel
    goToVaReport() : void {
        // 1. run reservation to read in the stmt info
        console.log('I clicked here');
        let reservationPromise: Promise<CommandMessageReservationRs> = getService(IReservationService).getReservation();
        reservationPromise.then(this.displayVALink.bind(this)).catch((error) => {
            console.log("Error while receiving reservation");
            console.log(error);
        });      
    }

    private displayVALink(commandMessageReservationRs: CommandMessageReservationRs): void {
        var reservation = commandMessageReservationRs['Data'];
        console.log(reservation);   
        var stmtinfo =  reservation.Passengers.Passenger[0].NameReference;
        console.log(stmtinfo); 
        var employeeNumberArray = stmtinfo.split('-'); // SAS-6785-7206 
        var employeeNumber=employeeNumberArray[1]; // 6785
        console.log(employeeNumber); 
        // 2. create link to VA
        var url = "https://itviya.sas.com/SASVisualAnalytics/?reportUri=%2Freports%2Freports%2F8e47b43a-7233-4d22-b4a1-16d0c77e5316&sectionIndex=0&sas-welcome=false&pr7188="+employeeNumber;
        console.log(url);
        window.open(url,'VA_Window');      
    }


  
    showMyHelloModalWindow() : void {
        console.log("I clicked on show hello modal");
        const modalOptions = {
            title: "Hello Modal",
            actions: [
                {
                    className: "app.common.views.Button",
                    caption: "Close",
                    actionName: "cancel",
                    type: "secondary"
                }
            ]
        }
        getService(LayerService).showInModal(new MyHelloModalWindow(),modalOptions)
    }

    private addToPnr(): void {
        new MyPnr().showInModal();
    }

    // for nudge

    filterForNudgeWithManySegmentsPerTrip(entries: NgvNudgeEntry[]): boolean {
        return entries.filter((entry, index, array) =>
            ((entry.location == 'AIR_AVAILABILITY' || entry.location == 'SHOPPING')
                && entry.origin == 'WAW' && entry.destination == 'LAS'))
            .length > 0;
    }

    filterForNudgeWithoutAction(entries: NgvNudgeEntry[]): boolean {
        return entries.filter((entry, index, array) =>
            ((entry.location == 'AIR_AVAILABILITY' || entry.location == 'SHOPPING')
                && entry.origin == 'JFK' && entry.destination == 'LAX'))
            .length > 0;
    }

    filterForNudge(entries: NgvNudgeEntry[]): boolean {
        return entries.filter(
            (entry, index, array) =>
                (
                    ((entry.location == 'AIR_AVAILABILITY' || entry.location == 'SHOPPING')
                        && ((entry.origin != 'JFK' && entry.destination == 'LAX')
                            || (entry.origin == 'JFK' && entry.destination == 'DFW')))
                )
        ).length > 0;
    }

    public  showView(): void {
        console.log("I clicked on handlebar modal");

        let addRemarkModalOptions = {
            title: 'Modal',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            },{
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'submit-modal',
                type: 'success'
            }]
        };

        getService(LayerService).showInModal(
            new MyHelloModalWindow({model: new BasicModel(null)}), addRemarkModalOptions, {display: 'areaView'}
        );
    }


    private openModal(): void {
        const layerService: LayerService = getService(LayerService);

        let modalOptions = {
            title: 'Soap API',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'submit-modal',
                type: 'success'
            }]
        };

        layerService.showInModal(
            new SoapView({ model: new AbstractModel() }),
            modalOptions,
            { display: 'areaView' }
        );
    }


    private openGetResModal(): void {
        const layerService: LayerService = getService(LayerService);

        let modalOptions = {
            title: 'Get Current PNR',
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'submit-modal',
                type: 'success'
            }]
        };

        layerService.showInModal(
            new GetResView({ model: new AbstractModel() }),
            modalOptions,
            { display: 'areaView' }
        );
    }



}
