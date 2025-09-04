
export interface IServiceConfigs {
    ARK_HOST: IServiceConfig;
    ARK_QUOTA: IServiceConfig;
    ID_SERVER: IServiceConfig;
    AUTH_TOKEN: string;
}

export interface IServiceConfig {
    HOST: string;
}

export interface AxiosClient {
    axiosInstance: any;
    updateHost: (newHost: string) => void;
    updateToken: (newToken: string) => void;
}