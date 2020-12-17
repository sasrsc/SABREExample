import * as React from 'react';

import {getService} from '../Context';
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {ICommandMessageService} from 'sabre-ngv-commsg/services/ICommandMessageService';
import {CommandMessageBasicRs, CommandMessageRq} from 'sabre-ngv-pos-cdm/commsg';
import {LayerService} from 'sabre-ngv-core/services/LayerService';
import {StatusView} from './StatusView';

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

export class CommandFormComponent extends React.Component<OwnProps, OwnState> {

    state: OwnState = {
        command: '',
        showRequest: true,
        showResponse: true
    };

    private handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const command: string = event.currentTarget.value;
        this.setState((state: OwnState, props: OwnProps) => {
            return {
                command: command,
                showRequest: state.showRequest,
                showResponse: state.showResponse
            };
        })
    };

    private handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const checked: boolean = event.currentTarget.checked;
        if (event.currentTarget.id === 'showRequest') {
            this.setState((state: OwnState, props: OwnProps) => {
                return {
                    command: state.command,
                    showRequest: checked,
                    showResponse: state.showResponse
                };
            })
        }
        else {
            this.setState((state: OwnState, props: OwnProps) => {
                return {
                    command: state.command,
                    showRequest: state.showRequest,
                    showResponse: checked
                };
            })
        }
    };

    private handleKeyUp = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
        if( event.key == 'Enter' ){
            await this.handleSubmit();
        }
    };

    private handleSubmit = async (event?: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event && event.preventDefault();

        // Hide popovers before open modal
        this.props.closePopovers();
        // Get reference for CommandMessageService
        const comMsgService: ICommandMessageService = getService(ICommandMessageService);
        // Create request
        const request: CommandMessageRq = {
            rq: this.state.command,
            showRq: this.state.showRequest,
            showRs: this.state.showResponse
        };
        // Send command
        const response: CommandMessageBasicRs = await comMsgService.send(request);
        // Show modal with response
        this.showStatusModal(response);
    };

    private handleCancel = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
        this.props.closePopovers();
    };

    private showStatusModal = (response: CommandMessageBasicRs): void => {
        const statusView = new StatusView();
        //statusView.setStatus(response.Status);
        console.log('response.Status');

        const layerService: LayerService = getService(LayerService);
        layerService.showInModal(
            statusView,
            {title: t('RESPONSE_STATUS')},
            {display: 'areaView'}
        );
    };

    render(): JSX.Element {
        return (
            <div className='com-sabre-example-redapp-web-module'>
                <div className='sample-form-container'>
                    <form onSubmit={this.handleSubmit} ref='form'>
                        <div className='fields-container'>
                            <div className='row'>
                                <div
                                    className='trip-id-element form-group col-xs-4 col-sm-4 col-md-4'>
                                    <label className='control-label'>{t('COMMAND_TO_SEND')}</label>
                                    <input type='text' id='command' name='cmdValue'
                                           title='Command input'
                                           className='input-field' value={this.state.command}
                                           onChange={this.handleChange} onKeyUp={this.handleKeyUp}/>
                                    <p>
                                        <label htmlFor="silentRequest">Show request</label>
                                        <input type='checkbox' id='showRequest' name='showRequest'
                                               title='Show request'
                                               className='input-field-checkbox' checked={this.state.showRequest}
                                               onChange={this.handleChangeCheckbox}/>

                                        <label htmlFor="silentResponse">Show response</label>
                                        <input type='checkbox' id='showResponse' name='showResponse'
                                               title='Show response'
                                               className='input-field-checkbox' checked={this.state.showResponse}
                                               onChange={this.handleChangeCheckbox}/>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='buttons-container'>
                            <div className='row'>
                                <div className='right-buttons'>
                                    <button id='cancel-button'
                                        className='cancel-button btn btn-outline btn-success'
                                        onClick={this.handleCancel}>
                                        {t('CANCEL')}
                                    </button>
                                    <button type='submit' id='submit-button'
                                            className='submit-button btn btn-success'>
                                        {t('SUBMIT')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}