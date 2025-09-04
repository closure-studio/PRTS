import { IServiceConfig } from "@/app/types/axios";
import ServerBase from "./base";


class ArkQuota extends ServerBase {
    constructor(config: IServiceConfig) {
        super(config);
    }
}

export default ArkQuota;