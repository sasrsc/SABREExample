import {Module} from 'sabre-ngv-core/modules/Module';


export class Main extends Module {
    init(): void {
        super.init();
        // initialize your module here

        console.log("Hello this is my second red app");
    }
}
