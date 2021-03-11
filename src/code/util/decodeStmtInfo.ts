import { AbstractService } from "sabre-ngv-app/app/services/impl/AbstractService";

export class StmtInfo {
  success: boolean;
  empNo: string;
  fop: string;
  costcent: string;
  vip: boolean;
  group: boolean;
}

export class DecodeStmtInfo extends AbstractService {
  static SERVICE_NAME = "com-sabre-example-redapp-web-module-DecodeStmtInfo";

  decode(nameReference: string) {
    if (
      nameReference !== undefined &&
      nameReference !== "" &&
      nameReference !== ""
    ) {
      let splitIntoArray = nameReference.split("-");

      // ^(?<fop>[a-zA-Z]{3})[\s-](?<empNo>[a-zA-Z0-9]+)[\s-](?<costcent>[a-zA-Z0-9]+)(-)?(?<vip>VIP)?(-)?(?<grp>GRP)?
      console.log(splitIntoArray);

      // SAS-6785-7206 or SAS-6785-7206-VIP or SAS-6785-7206-GRP or SAS-6785-7206-GRPVIP
      //   let fop = splitIntoArray[0];
      //   let empno = splitIntoArray[1];
      //   let costcent = splitIntoArray[2];
      let temp = new StmtInfo();
      temp.success = true;
      temp.empNo = splitIntoArray[1];
      temp.fop = splitIntoArray[0];
      temp.costcent = splitIntoArray[2];
      temp.vip = false;
      temp.group = false;
      console.log(temp);
      return temp;
    }
  }
}
