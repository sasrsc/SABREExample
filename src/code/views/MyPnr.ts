import {Mixin} from 'sabre-ngv-core/decorators/classes/Mixin';
import {WithShowInModal} from 'sabre-ngv-app/app/common/mixins/WithShowInModal';
import {WithValidation} from 'sabre-ngv-app/app/common/mixins/WithValidation';
import {OnKeyCombo} from 'sabre-ngv-core/decorators/methods/domEvents/OnKeyCombo';
import {PnrAdd} from 'sabre-ngv-app/app/widgets/pnrAdd/views/PnrAdd';
import {PnrAddSubmitter} from 'sabre-ngv-app/app/widgets/pnrAdd/models/PnrAddSubmitter';
import {LayerService} from "sabre-ngv-core/services/LayerService";
import {MessageView} from "./MessageView";
import {getService} from "../Context";

@Mixin(WithShowInModal)
@Mixin(WithValidation)
export class MyPnr extends PnrAdd implements WithShowInModal, WithValidation {

    constructor() {
        super()
    }

    modalOptions = {
        title: 'Customised Add To PNR',
        cssClass: 'dn-panel add-to-pnr-modal add-to-pnr-secure-flight',
        actions: [
            {
                caption: 'Cancel',
                actionName: 'cancel',
                type: 'secondary'
            },
            {
                caption: 'Submit',
                actionName: 'my-pnr',
                type: 'success'
            }
        ]
    };

    @OnKeyCombo('enter')
    public enterHandler() {
        this.selfMyPnrAction();
    }

    private selfCancelAction() {
        super.triggerOnEventBus('close-modal');
    }

    private selfMyPnrAction() {


        if (super._validateForm()) {
            let submitter = new PnrAddSubmitter({form: this});
            submitter.submit()
                .done(() => {
                        console.log("PNR Information has been added");
                        getService(LayerService).showInModal(new MessageView({
                            model: {message: "PNR created"}
                        }), {title: "PNR Status"}, {display: 'areaView'});
                    }
                )
                .fail((error) => {
                    console.log("Error occurred " + JSON.stringify(error));
                    getService(LayerService).showInModal(new MessageView({
                        model: {message: "PNR creation failed"}
                    }), {title: "PNR Status"}, {display: 'areaView'});
                });
            super.triggerOnEventBus('close-modal');
        }
    }

    validate: () => boolean;

    showInModal: () => void;

}