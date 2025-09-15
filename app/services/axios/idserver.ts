import { IAuthLoginResponse } from "@/app/types/auth";
import { ApiCallOptions, IApiResponse, IServiceConfig } from "@/app/types/axios";
import ServerBase from "./base";
class IdServer extends ServerBase {
    constructor(config: IServiceConfig) {
        // Call the parent class constructor
        super(config);
    }
    // A generic method to handle API responses
    protected async handleResponse<T>(promise: Promise<any>): Promise<IApiResponse<T>> {
        try {
            const resp = await promise;
            return resp.data as IApiResponse<T>;
        } catch (error: any) {
            if (error.response) {
                return {
                    code: error.response.status,
                    message: error.response.data?.message || error.message,
                };
            } else if (error.request) {
                return {
                    code: 0,
                    message: "Network error",
                };
            } else {
                return {
                    code: 500,
                    message: error.message || "Unknown error",
                };
            }
        }
    }
    async login(username: string, password: string): Promise<IAuthLoginResponse | undefined> {
        return this.post<IAuthLoginResponse>('/login', {
            data: { username, password },
            errorPrefix: 'Login'
        });
    }
}
export default IdServer;