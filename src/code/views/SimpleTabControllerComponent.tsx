import * as React from 'react';
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {getService} from '../Context';
import {AbstractModel} from 'sabre-ngv-app/app/AbstractModel';
import {QueuePlaceFormComponent} from './QueuePlaceFormComponent';
import {SASFormExtends} from './SASFormExtends';
import {IFormsService} from 'sabre-ngv-forms/services/IFormsService';
import {StatusView} from './StatusView';
import {CommandMessageBasicRs} from 'sabre-ngv-pos-cdm/commsg';
import {CommandFormComponent} from './CommandFormComponent';
import { SASFormModal } from './SASFormModal';

import { LayerService } from "sabre-ngv-core/services/LayerService";

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator('com-sabre-example-redapp-web-module/translations');
const eventBus: AbstractModel = new AbstractModel();


export const ActionType = Object.freeze({
    openQueuePlaceForm: 'openQueuePlace',
    openFormToFill: 'openFormToFill',
    openSasForm: 'openSasForm',
    openCommandForm: 'openCommandForm',
    openSasFormExtends: 'openSasFormExtends',
    openSasFormModal: 'openSasFormModal'
});

export interface OwnState {
    showFormQueuePlacePayload: boolean,
    showSASFormExtends: boolean
}

// export interface OwnProps {
//     closePopovers: () => void;
// }

export class SimpleTabControllerComponent extends React.Component<{}, OwnState> {
    private readonly formsService: IFormsService = getService<IFormsService>(IFormsService);

    state: OwnState = {
        showFormQueuePlacePayload: false,
        showSASFormExtends: false
    };

    private closePopovers = (): void => {
        eventBus.triggerOnEventBus('hide-popovers', 'novice-menu');
    };


    private openQueuePlaceForm = async (): Promise<void> => {
        const response: CommandMessageBasicRs = await this.formsService.openForm({
                QueuePlaceRq: {
                    Queue: []
                }
            }
        );
        StatusView.showStatusModal(response);
    };

    private renderQueuePlaceForm = (): JSX.Element => {
        return <QueuePlaceFormComponent closePopovers={this.closePopovers}/>
    };

    private renderSASExtendsForm = (): JSX.Element => {
        return <SASFormExtends closePopovers={this.closePopovers}/>
    };

    private handleChange = (type) => (): void => {
        switch (type) {
            case ActionType.openQueuePlaceForm:
                this.openQueuePlaceForm();
                break;
            case ActionType.openFormToFill:
                this.toggleShowForm();
                break;
            case ActionType.openSasForm:
                this.showMySASFormLog();
                break;
            case ActionType.openCommandForm:
                this.showCommandFormModal();
                break;
            case ActionType.openSasFormExtends:
                this.toggleShowSASFormExtends();
                break;
            case ActionType.openSasFormModal:
                this.showopenSasFormModal();
                break;
        }
    };

    private toggleShowForm(): void {
        this.setState(prevState => ({
            showFormQueuePlacePayload: !prevState.showFormQueuePlacePayload
        }));
    }
    private toggleShowSASFormExtends(): void {
        this.setState(prevState => ({
            showSASFormExtends: !prevState.showSASFormExtends
        }));
    }

    private showCommandFormModal() : void {
        // something here for the form 
        console.log('I should open a custom command form');
        // getService(LayerService).showInModal(new SasFormView(),modalOptions);
    }
    private showMySASFormLog() : void {
        // something here for the form 
        console.log('I should open a sas custom form but all I do is a console log right now');
        // getService(LayerService).showInModal(new SasFormView(),modalOptions);
    }
    private showOpenSasFormExtends() : void {
        // something here for the form 
        console.log('I will extend the current screen');
        // getService(LayerService).showInModal(new SasFormView(),modalOptions);
    }
    private showopenSasFormModal() : void {
        // close popover
        // Hide popovers before open modal
        this.closePopovers();
        // something here for the form 
        console.log('I will open a new SAS Modal window');
        const modalOptions = {
            title: "SAS Modal Window",
            actions: [{
                className: 'app.common.views.Button',
                caption: 'Cancel',
                actionName: 'handleCancel',
                type: 'secondary'
            }, {
                className: 'app.common.views.Button',
                caption: 'Submit',
                actionName: 'handleSubmit',
                type: 'secondary'
            }]            
        }
        //getService(LayerService).showInModal(new SASFormModal(),modalOptions);

        getService(LayerService).showInModal(new SASFormModal(), {title: "SAS Modal"}, {display: 'areaView'});


    }

    render(): JSX.Element {
        return (
            <div className='com_sabre_example_redapp_web_module_forms_service'>
                <div className='sample-form-container'>
                    <div className='buttons-container'>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openCommandForm)}>Custom Command</button>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openQueuePlaceForm)}>{t('Queue Form')}
                        </button>
                        <button
                            className='success-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openFormToFill)}>{t('Queue Payload')}
                        </button>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openSasForm)}>{t('SAS Form')}
                        </button>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openSasFormExtends)}>SAS Extends</button>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openSasFormModal)}>SAS New Modal</button>
                    </div>
                </div>
                {this.state.showFormQueuePlacePayload && this.renderQueuePlaceForm()}
                {this.state.showSASFormExtends && this.renderSASExtendsForm()}
            </div>
        )
    }
}
