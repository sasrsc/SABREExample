import { AbstractView } from "sabre-ngv-app/app/AbstractView";
import { AbstractModel } from "sabre-ngv-app/app/AbstractModel";
import { Template } from "sabre-ngv-core/decorators/classes/view/Template";
import {​​ AbstractActionOptions }​​ from "sabre-ngv-app/app/common/views/AbstractActionOptions";
import {CssClass} from "sabre-ngv-core/decorators/classes/view/CssClass";

@CssClass('com-sabre-example-redapp-web-module')
@Template("com-sabre-example-redapp-web-module:MyHelloModalWindow")

export class MyHelloModalWindow extends AbstractView<AbstractModel> {
    // listen to when the user types in something
    initialize(options: AbstractActionOptions) {​​​​
        super.initialize(options);
    }​​​​

    // this is the modal footer submit button //
    selfSubmitModalAction(): void {
        console.log("I clicked on Modal footer submit (not a form submit)");
        //console.log(HkToYkForm)

        // gather form data
        let frmEmail: string=this.$('#inputEmail4').val();
        let frmDate: string=this.$('#inputDate').val();
        // convert Date: 2020-12-17 as need ddmmm

        let frmAddr: string=this.$('#inputAddress').val();
        let frmCity: string=this.$('#inputCity').val();
        let frmState: string=this.$('#inputState').val();
        let frmZip: string=this.$('#inputZip').val();
        let frmBoolean: string=this.$('#gridCheck').val();

        console.log('Email: ' + frmEmail); 
        console.log('Date: ' + frmDate); 
        console.log('Addr: ' + frmAddr); 
        console.log('City: ' + frmCity); 
        console.log('State: ' + frmState); 
        console.log('Zip: ' + frmZip); 
        console.log('Checkbox: ' + frmBoolean); 
    }

}