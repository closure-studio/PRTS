import { IApiResponse, IServiceConfig } from "@/app/types/axios";
import ServerBase from "./base";


class ArkQuota extends ServerBase {
    protected handleResponse<T>(promise: Promise<any>): Promise<IApiResponse<T>> {
        throw new Error("Method not implemented.");
    }
    constructor(config: IServiceConfig) {
        super(config);
    }
}

export default ArkQuota;