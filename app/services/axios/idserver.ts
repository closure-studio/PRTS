import { IServiceConfig } from "@/app/types/axios";
import ServerBase from "./base";

// class
class IdServer extends ServerBase {
    constructor(config: IServiceConfig) {
        // Call the parent class constructor
        super(config);
    }
}
export default IdServer;