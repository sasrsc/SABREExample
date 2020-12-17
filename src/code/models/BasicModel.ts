import {Initial} from 'sabre-ngv-core/decorators/classes/Initial';
import {AbstractModelOptions} from 'sabre-ngv-app/app/AbstractModelOptions';
import {AbstractModel} from "sabre-ngv-app/app/AbstractModel";
import { CustomCommandRs } from "sabre-ngv-customCommand/domain/CustomCommandRs";


@Initial<AbstractModelOptions>({
    autoPropagateData: true,
})
export class BasicModel extends AbstractModel {

    resolve: (value ?: CustomCommandRs )=>void;

    constructor(resolve) {
        super();

    }

}