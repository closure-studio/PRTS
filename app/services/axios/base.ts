import { ApiCallOptions, IApiResponse, IServiceConfig } from '@/app/types/axios';
import { logger } from "react-native-logs";
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { LOG } from '@/app/utils/loger/logger';

abstract class ServerBase {
    log = LOG.extend('AxiosBase');
    // axios instance
    private instance: AxiosInstance;
    private isTokenExpired?: () => boolean;
    private refreshToken?: () => Promise<void>;
    private isRefreshing = false;
    private failedQueue: Array<{
        resolve: (token: string | null) => void;
        reject: (error: any) => void;
    }> = [];

    constructor(config: IServiceConfig) {
        // Initialize the instance here (e.g., Axios instance)
        this.instance = axios.create({
            baseURL: config.HOST,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add response interceptor to unify response format
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                // Transform the response to { code, data, message }
                response.data = {
                    code: response.status,
                    data: response.data,
                    message: response.statusText,
                };
                return response; // Return the
            },
            (error) => {
                // Handle errors and unify error response format
                return Promise.reject({
                    code: error.response?.status || 500,
                    data: null,
                    message: error.response?.data?.message || error.message || 'Unknown error',
                });
            }
        );
    }

    private setupInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            async (config) => {
                // Skip token check for login requests
                if (config.url?.includes('/login')) {
                    return config;
                }

                // Check if token is expired and refresh logic is available
                if (this.isTokenExpired && this.refreshToken && this.isTokenExpired()) {
                    const newToken = await this.handleTokenRefresh();
                    if (newToken) {
                        config.headers.Authorization = `Bearer ${newToken}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for handling 401 errors
        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (this.isRefreshing) {
                        // If already refreshing, queue the request
                        return new Promise((resolve, reject) => {
                            this.failedQueue.push({ resolve, reject });
                        }).then(token => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return this.instance(originalRequest);
                        }).catch(err => {
                            return Promise.reject(err);
                        });
                    }

                    originalRequest._retry = true;
                    const newToken = await this.handleTokenRefresh();

                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.instance(originalRequest);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // ...existing code...
    private async handleTokenRefresh(): Promise<string | null> {
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.failedQueue.push({ resolve, reject });
            });
        }

        this.isRefreshing = true;

        try {
            const newToken = await this.refreshToken?.() ?? null;

            // Process all queued requests
            this.failedQueue.forEach(({ resolve }) => {
                resolve(newToken);
            });

            return newToken;
        } catch (error) {
            // Reject all queued requests
            this.failedQueue.forEach(({ reject }) => {
                reject(error);
            });
            return null;
        } finally {
            this.isRefreshing = false;
            this.failedQueue = [];
        }
    }
    // ...existing code...

    public setTokenRefreshLogic(
        isTokenExpired: () => boolean,
        refreshToken: () => Promise<void>
    ) {
        this.isTokenExpired = isTokenExpired;
        this.refreshToken = refreshToken;
    }


    // 抽象方法，子类必须实现
    protected abstract handleResponse<T>(promise: Promise<any>): Promise<IApiResponse<T>>;

    // 通用POST方法
    protected async post<T>(url: string, options?: ApiCallOptions): Promise<T | undefined> {
        const { data, errorPrefix, ...axiosConfig } = options || {};

        const resp = await this.handleResponse<T>(
            this.getInstance().post(url, data, axiosConfig)
        );
        if (!resp.data) {
            this.log.error(`${errorPrefix || 'POST Request'} failed:`, resp.message);
            return undefined;
        }
        return resp.data;
    }

    // 通用GET方法
    protected async get<T>(url: string, options?: ApiCallOptions): Promise<T | undefined> {
        const { errorPrefix, ...axiosConfig } = options || {};

        const resp = await this.handleResponse<T>(
            this.getInstance().get(url, axiosConfig)
        );
        if (!resp.data) {
            this.log.error(`${errorPrefix || 'GET Request'} failed:`, resp.message);
            return undefined;
        }
        return resp.data;
    }

    // 通用PUT方法
    protected async put<T>(url: string, options?: ApiCallOptions): Promise<T | undefined> {
        const { data, errorPrefix, ...axiosConfig } = options || {};

        const resp = await this.handleResponse<T>(
            this.getInstance().put(url, data, axiosConfig)
        );
        if (!resp.data) {
            this.log.error(`${errorPrefix || 'PUT Request'} failed:`, resp.message);
            return undefined;
        }
        return resp.data;
    }

    // 通用DELETE方法
    protected async delete<T>(url: string, options?: ApiCallOptions): Promise<T | undefined> {
        const { errorPrefix, ...axiosConfig } = options || {};

        const resp = await this.handleResponse<T>(
            this.getInstance().delete(url, axiosConfig)
        );
        if (!resp.data) {
            this.log.error(`${errorPrefix || 'DELETE Request'} failed:`, resp.message);
            return undefined;
        }
        return resp.data;
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