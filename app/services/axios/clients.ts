import useStore from '@/app/stores/persistedStore';
import { IAuthInfo } from '@/app/types/auth';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import ArkHost from './arkHost';
import IdServer from './idServer';

const useServicesClient = () => {
    // case 1, if credentials is null, we can't login to get token
    const { authCredentials, setAuthCredentials } = useStore((state) => state);
    const { authInfo, setAuthInfo } = useStore((state) => state);
    const { serviceConfigs } = useStore((state) => state);

    const arkHost = new ArkHost(serviceConfigs.ARK_HOST);
    const arkQuota = new ArkHost(serviceConfigs.ARK_QUOTA);
    const idServer = new IdServer(serviceConfigs.ID_SERVER);

    // Token refresh function
    const refreshToken = async (): Promise<void> => {
        try {
            if (!authCredentials) {
                console.warn('No credentials available for token refresh.');
                return;
            }
            const { email, password } = authCredentials;
            if (!email || !password) {
                console.warn('Incomplete credentials for token refresh.');
                return;
            }
            // 这里需要您的登录凭据，可能需要从本地存储获取
            const response = await idServer.login(email, password);
            if (response?.token) {
                const payload = jwtDecode<IAuthInfo>(response.token);
                setAuthInfo(payload);
                setAuthCredentials({ ...authCredentials, token: response.token });
                return;
            }
            return;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return;
        }
    };

    // Token validation function
    const isTokenExpired = (): boolean => {
        if (!authInfo?.exp) return true;
        return Date.now() >= authInfo.exp;
    };

    useEffect(() => {
        arkHost.setBaseURL(serviceConfigs.ARK_HOST.HOST);
        idServer.setBaseURL(serviceConfigs.ID_SERVER.HOST);
        arkQuota.setBaseURL(serviceConfigs.ARK_QUOTA.HOST);

        // Set token refresh logic for all clients except idServer
        arkHost.setTokenRefreshLogic(isTokenExpired, refreshToken);
        arkQuota.setTokenRefreshLogic(isTokenExpired, refreshToken);

        // update jwt token
        if (authCredentials?.token) {
            const authValue = `Bearer ${authCredentials.token}`;
            idServer.setAuthToken(authValue);
            arkQuota.setAuthToken(authValue);
            arkHost.setAuthToken(authValue);
        }
    }, [serviceConfigs, authCredentials?.token]);

    return { idServer, arkQuota, arkHost };
};

export default useServicesClient;