
import { IServiceConfig } from '@/app/types/axios';
import axios, { AxiosInstance } from 'axios';

class ServerBase {
    // axios instance
    private instance: AxiosInstance;

    constructor(config: IServiceConfig) {
        // Initialize the instance here (e.g., Axios instance)
        this.instance = axios.create({
            baseURL: config.HOST,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    setBaseURL(newHost: string) {
        this.instance.defaults.baseURL = newHost;
    }

    setAuthToken(newToken: string) {
        const authValue = `Bearer ${newToken}`;
        this.instance.defaults.headers.common['Authorization'] = authValue;
    }
    
    getInstance(): AxiosInstance {
        return this.instance;
    }
}

export default ServerBase;