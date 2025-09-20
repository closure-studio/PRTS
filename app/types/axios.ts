
export interface IServiceConfigs {
    ARK_HOST: IServiceConfig;
    ARK_QUOTA: IServiceConfig;
    ID_SERVER: IServiceConfig;
}

export interface IServiceConfig {
    HOST: string;
}

export interface ApiCallOptions {
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    errorPrefix?: string;
    [key: string]: any;
}


export interface IApiResponse<T> {
    code: number;
    data?: T;
    message: string;
}

export interface AxiosClient {
    axiosInstance: any;
    updateHost: (newHost: string) => void;
    updateToken: (newToken: string) => void;
}