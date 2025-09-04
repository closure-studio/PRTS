import { IServiceConfig } from "@/app/types/axios";
import ServerBase from "./base";


class ArkHost extends ServerBase {
    constructor(config: IServiceConfig) {
        super(config);
    }
}

export default ArkHost;