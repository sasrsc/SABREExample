import * as React from 'react';
import {getService} from '../Context';
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {IFormsService} from 'sabre-ngv-forms/services/IFormsService';
import {FormsQueuePlaceRq} from 'sabre-ngv-forms/models/FormsQueuePlaceRq';
import {CommandMessageBasicRs} from 'sabre-ngv-pos-cdm/commsg';
import {StatusView} from './StatusView';

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator('com-sabre-example-redapp-web-module/translations');

export interface OwnProps {
    closePopovers: () => void;
}

export interface OwnState {
    areaTextValue: string;
}

const initialAreaTextValue: FormsQueuePlaceRq = {
    QueuePlaceRq: {
        Queue: [{
            QueueNumber: '156',
            PrefatoryInstructionCode: '1',
            PseudoCityCode: '29JB'
        }]
    }
};

export class QueuePlaceFormComponent extends React.Component<OwnProps, OwnState> {
    state = {
        areaTextValue: this.formatCode(initialAreaTextValue)
    };

    private handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        this.setState({
            areaTextValue: event.currentTarget.value
        });
    };

    private formatCode(code: string | object): string {
        return JSON.stringify(code, null, 2);
    }

    private handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        await this.handleFormSubmit(this.state.areaTextValue);
    };

    private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        this.props.closePopovers();
    };

    private handleFormSubmit = async (queuePlaceRq: string): Promise<void> => {

        // Get reference for IFormsService
        const formsService: IFormsService = getService<IFormsService>(IFormsService);
        // Open Queue Placement model with populated data
        try {
            const rq = JSON.parse(queuePlaceRq);

            // Hide popovers before open modal
            this.props.closePopovers();

            const response: CommandMessageBasicRs = await formsService.openForm(rq);
            // Show response
            StatusView.showStatusModal(response);
        } catch(ex) {
            alert(ex);
        }
    };

    render(): JSX.Element {
        return (
            <div className='com_sabre_example_redapp_web_module'>
                <div className='sample-form-container'>
                    <form onSubmit={this.handleSubmit} ref='form'>
                        <div className='fields-container'>{/**/}
                            <div className="url-field form-group">
                                <div className="payload-field form-group">
                                    <label>{t('LABEL_PAYLOAD')}</label>
                                    <textarea rows={10} cols={90} name="payload" id="{{new-random 'payload-field'}}"
                                              className="not-empty form-control input-form payload"
                                              onChange={this.handleChange} value={this.state.areaTextValue} />
                                </div>
                            </div>
                            <div className='buttons-container'>
                                <div className='row'>
                                    <div className='right-buttons'>
                                        <button
                                            className='cancel-button js_form-cancel btn btn-outline btn-success'
                                            onClick={this.handleCancel}>Cancel
                                        </button>
                                        <button type='submit'
                                                className='search-button js_form-submit btn btn-success'>
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
