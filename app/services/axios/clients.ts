import { CONSTANTS } from '@/app/constants/constants';
import { IServiceConfigs } from '@/app/types/axios';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ArkHost from './arkHost';
import { IAuthInfo } from '@/app/types/auth';
import IdServer from './idserver';

const useServicesClient = () => {
    const config = useRef<IServiceConfigs>(CONSTANTS.SERVICE_CONFIGS);
    const [authInfo, setAuthInfo] = useState<IAuthInfo | null>(null);
    const arkHost = new ArkHost(config.current.ARK_HOST);
    const arkQuota = new ArkHost(config.current.ARK_QUOTA);
    const idServer = new IdServer(config.current.ID_SERVER);

    // Token refresh function
    const refreshToken = async (): Promise<string | null> => {
        try {
            // 这里需要您的登录凭据，可能需要从本地存储获取
            const response = await idServer.login("your_username", "your_password");
            if (response?.token) {
                const newAuthInfo: IAuthInfo = {
                    ...response,
                    exp: Date.now() + 1000, // 假设expiresIn是秒数
                    createdAt: Date.now(),
                    email: '',
                    isAdmin: false,
                    permission: 0,
                    status: 0,
                    uuid: ''
                };
                setAuthInfo(newAuthInfo);
                return response.token;
            }
            return null;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    };

    // Token validation function
    const isTokenExpired = (): boolean => {
        if (!authInfo?.exp) return true;
        return Date.now() >= authInfo.exp;
    };

    const updateServiceConfigs = (newConfig: Partial<IServiceConfigs>) => {
        config.current = { ...config.current, ...newConfig };
    }


    useEffect(() => {
        arkHost.setBaseURL(config.current?.ARK_HOST.HOST);
        idServer.setBaseURL(config.current?.ID_SERVER.HOST);
        arkQuota.setBaseURL(config.current?.ARK_QUOTA.HOST);

        // Set token refresh logic for all clients except idServer
        arkHost.setTokenRefreshLogic(isTokenExpired, refreshToken);
        arkQuota.setTokenRefreshLogic(isTokenExpired, refreshToken);
        
        // update jwt token
        if (config.current?.AUTH_TOKEN) {
            const authValue = `Bearer ${config.current.AUTH_TOKEN}`;
            idServer.setAuthToken(authValue);
            arkQuota.setAuthToken(authValue);
            arkHost.setAuthToken(authValue);
        }
    }, [config.current]);

    return { idServer, arkQuota, arkHost, updateServiceConfigs };
};

export default useServicesClient;