import {AbstractView} from 'sabre-ngv-app/app/AbstractView';
import {Template} from 'sabre-ngv-core/decorators/classes/view/Template';
import {AbstractViewOptions} from 'sabre-ngv-app/app/AbstractViewOptions';
import {Initial} from 'sabre-ngv-core/decorators/classes/Initial';
import {I18nService, ScopedTranslator} from 'sabre-ngv-app/app/services/impl/I18nService';
import {CssClass} from 'sabre-ngv-core/decorators/classes/view/CssClass';
import {AbstractActionOptions} from 'sabre-ngv-app/app/common/views/AbstractActionOptions';
import {AbstractModel} from 'sabre-ngv-app/app/AbstractModel';
import {getService} from '../Context';
import {CommandMessageStatus, CommandMessageBasicRs} from 'sabre-ngv-pos-cdm/commsg';
import {LayerService} from 'sabre-ngv-core/services/LayerService';

const i18n: I18nService = getService(I18nService);
const t: ScopedTranslator = i18n.getScopedTranslator('com-sabre-example-redapp-web-module/translations');

@Initial<AbstractViewOptions>({
    templateOptions: {
        helpers: {
            _t: i18n.getScopedHelper('com-sabre-example-redapp-web-module/translations')
        }
    }
})
@Template('com-sabre-example-redapp-web-module:StatusView')
@CssClass('command-message-status-view')
export class StatusView extends AbstractView<AbstractModel> {
    initialize(options: AbstractActionOptions) {
        super.initialize(options);
    }

    private setStatus(status: CommandMessageStatus): void {
        this.set('success', status.Success);
        this.set('messages', status.Messages.map(m => m.Text))
    }

    private setCloseStatus(): void {
        this.set('success', false);
        this.set('messages', ['Queue placement modal was closed by user.'])
    }

    static showStatusModal = (response: CommandMessageBasicRs): void => {
        const statusView = new StatusView();
        if(response) {
            statusView.setStatus(response.Status);
        } else {
            statusView.setCloseStatus();
        }

        const layerService: LayerService = getService(LayerService);
        layerService.showInModal(
            statusView,
            {title: t('RESPONSE_STATUS')},
            {display: 'areaView'}
        );
    };
}
