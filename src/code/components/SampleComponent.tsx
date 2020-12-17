import * as React from 'react';
import {getService} from "../Context";
import {EventBusService} from 'sabre-ngv-app/app/services/impl/EventBusService';
import {PnrSectionType} from 'sabre-ngv-app/app/services/impl/PnrSectionType';
import {PnrPublicService} from 'sabre-ngv-app/app/services/impl/PnrPublicService';

export interface myState {
    pnrSectionType: PnrSectionType
}

export class SampleComponent extends React.Component<{}, myState> {

    constructor(props) {
        super(props);
        this.state = {
            pnrSectionType: 'full'
        }
    }

    handleChange = (event) => {
        this.setState({
            pnrSectionType: event.target.value
        });
    }

    private handleDisplayGpnrClick = () => {
        getService(PnrPublicService).displayGraphicalPnr(this.state.pnrSectionType);
        getService(EventBusService).triggerOnEventBus('hide-popovers', 'novice-menu');
    };

    private handleCancel = () => {
        getService(EventBusService).triggerOnEventBus('hide-popovers', 'novice-menu');
    };

    render() {
        return (
            <div className='com-sabre-redapp-example3-web-graphicalpnr-web-module'>
                <div className='sample-component-container'>
                    <div className='fields-container'>
                        <div className='row'>
                            <div className='form-group col-xs-4 col-sm-4 col-md-4'>
                                <label className='control-label'>PNR Section Type</label>
                                <select className='form-control' onChange={this.handleChange} value={this.state.pnrSectionType}>
                                    <option value='full'>full</option>
                                    <option value='itinerary'>itinerary</option>
                                    <option value='price-quotes'>price-quotes</option>
                                    <option value='ticketing'>ticketing</option>
                                    <option value='history'>history</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='buttons-container'>
                        <div className='row'>
                            <div className='right-buttons'>
                                <button className='cancel-button btn btn-outline btn-success' onClick={this.handleCancel}>Cancel</button>
                                <button className='btn btn-success' onClick={this.handleDisplayGpnrClick}>Display Graphical PNR</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
