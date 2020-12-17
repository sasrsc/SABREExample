import {getService} from '../Context';
import {ICommandMessageService} from 'sabre-ngv-commsg/services/ICommandMessageService';
import {CommandMessageBasicRs, CommandMessageRq} from 'sabre-ngv-pos-cdm/commsg';
import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";
import {StatusView} from '../views/StatusView';
import { LayerService } from "sabre-ngv-core/services/LayerService";

export class NativeSabreCommand extends AbstractService {
    
    static SERVICE_NAME = 'NativeSabreCommand';
    
    handleSubmit = async (sabreEntry: string): Promise<void> => {
            
        // Hide popovers before open modal
        //this.props.closePopovers();
        // Get reference for CommandMessageService
        const comMsgService: ICommandMessageService = getService(ICommandMessageService);
        // Create request
        const request: CommandMessageRq = {
            rq: sabreEntry,
            showRq: true,
            showRs: true
        };
        // Send command
        const response: CommandMessageBasicRs = await comMsgService.send(request);
        // Show modal with response
        this.showStatusModal(response);
    };  

    
    private showStatusModal = (response: CommandMessageBasicRs): void => {
        const statusView = new StatusView();
        //statusView.setStatus(response.Status);
        console.log('response.Status');

        const layerService: LayerService = getService(LayerService);
        layerService.showInModal(
            statusView,
            {title: 'SABRE Response'},
            {display: 'areaView'}
        );
    };

}