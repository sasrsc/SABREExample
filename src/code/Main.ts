import { Module } from 'sabre-ngv-core/modules/Module';
import { getService } from './Context';
import { ExtensionPointService } from "sabre-ngv-xp/services/ExtensionPointService";
import { RedAppSidePanelConfig } from "sabre-ngv-xp/configs/RedAppSidePanelConfig";
import { WidgetXPConfig } from 'sabre-ngv-xp/configs/WidgetXPConfig';
import { RedAppSidePanelButton } from "sabre-ngv-redAppSidePanel/models/RedAppSidePanelButton";
import { LayerService } from "sabre-ngv-core/services/LayerService";
import { BasicView } from './BasicView';
import StaticButton from './views/StaticButton';

export class Main extends Module {
    init(): void {
        super.init();
        // initialize your module here
        console.log("Hello this is my third update to the red app");

        // used for the right side panel
        const xp = getService(ExtensionPointService);
        const sidepanelConfig = new RedAppSidePanelConfig([
            new RedAppSidePanelButton("Show hello modal","", () => { this.showHelloModal(); })
        ]);
  
        // used for the form
        const extensionPointService: ExtensionPointService = getService(ExtensionPointService);
        extensionPointService.addConfig('novice-buttons', new WidgetXPConfig(StaticButton, -1000));
        xp.addConfig("redAppSidePanel", sidepanelConfig);


    }

    // right hand side panel
    showHelloModal() : void {
        const modalOptions = {
            title: "Hello Modal",
            actions: [
                {
                    className: "app.common.view.Button",
                    caption: "Quit",
                    actionName: "cancel",
                    type: "secondary"
                }
            ]
        }
        getService(LayerService).showInModal(new BasicView(),modalOptions)
    }
}
