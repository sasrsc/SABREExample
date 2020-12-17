import {AbstractView} from 'sabre-ngv-app/app/AbstractView';
import {AbstractViewOptions} from 'sabre-ngv-app/app/AbstractViewOptions';
import {BasicModel} from '../models/BasicModel';
import {Template} from "sabre-ngv-core/decorators/classes/view/Template";
import {Initial} from 'sabre-ngv-core/decorators/classes/Initial';
import {I18nService, ScopedTranslator} from "sabre-ngv-app/app/services/impl/I18nService";
import {getService} from "../Context";

const i18nService: I18nService = getService(I18nService);
@Template('com-sabre-redapp-example3-web-customcommand-web-module:BasicView')
export class BasicView extends AbstractView<BasicModel> {

    constructor(options?: AbstractViewOptions) {
        super(options);
    }

    selfSubmit() {
        if(super.getModel().resolve) {
            super.getModel().resolve();
        }
        super.triggerOnEventBus('close-modal');
    }

}
