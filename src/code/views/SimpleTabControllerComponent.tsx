import * as React from 'react';
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {getService} from '../Context';
import {AbstractModel} from 'sabre-ngv-app/app/AbstractModel';
import {QueuePlaceFormComponent} from './QueuePlaceFormComponent';
import {IFormsService} from 'sabre-ngv-forms/services/IFormsService';
import {StatusView} from './StatusView';
import {CommandMessageBasicRs} from 'sabre-ngv-pos-cdm/commsg';

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator('com-sabre-example-redapp-web-module/translations');
const eventBus: AbstractModel = new AbstractModel();

export const ActionType = Object.freeze({
    openQueuePlaceForm: 'openQueuePlace',
    openFormToFill: 'openFormToFill'
});

export interface OwnState {
    showFormQueuePlacePayload: boolean;
}

export class SimpleTabControllerComponent extends React.Component<{}, OwnState> {
    private readonly formsService: IFormsService = getService<IFormsService>(IFormsService);

    state: OwnState = {
        showFormQueuePlacePayload: false
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

    private handleChange = (type) => (): void => {
        switch (type) {
            case ActionType.openQueuePlaceForm:
                this.openQueuePlaceForm();
                break;
            case ActionType.openFormToFill:
                this.toggleShowForm();
                break;
        }
    };

    private toggleShowForm(): void {
        this.setState(prevState => ({
            showFormQueuePlacePayload: !prevState.showFormQueuePlacePayload
        }));
    }

    render(): JSX.Element {
        return (
            <div className='com_sabre_example_redapp_web_module'>
                <div className='sample-form-container'>
                    <div className='buttons-container'>
                        <button
                            className='cancel-button btn btn-outline btn-success'
                            onClick={this.handleChange(ActionType.openQueuePlaceForm)}>{t('Queue Form')}
                        </button>
                        <button
                            className='search-button btn btn-success'
                            onClick={this.handleChange(ActionType.openFormToFill)}>{t('Queue Payload')}
                        </button>
                    </div>
                </div>
                {this.state.showFormQueuePlacePayload && this.renderQueuePlaceForm()}
            </div>
        )
    }
}
