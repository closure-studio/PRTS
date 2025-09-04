import { CONSTANTS } from '@/app/constants/constants';
import { IServiceConfigs } from '@/app/types/axios';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import ArkHost from './arkHost';

const useServicesClient = () => {
    const config = useRef<IServiceConfigs>(CONSTANTS.SERVICE_CONFIGS);
    const arkHost = new ArkHost(config.current.ARK_HOST);
    const arkQuota = new ArkHost(config.current.ARK_QUOTA);
    const idServer = new ArkHost(config.current.ID_SERVER);

    
    const updateServiceConfigs = (newConfig: Partial<IServiceConfigs>) => {
        config.current = { ...config.current, ...newConfig };
    }


    useEffect(() => {
        arkHost.setBaseURL(config.current?.ARK_HOST.HOST);
        idServer.setBaseURL(config.current?.ID_SERVER.HOST);
        arkQuota.setBaseURL(config.current?.ARK_QUOTA.HOST);
        // update jwt token
        if (config.current?.AUTH_TOKEN) {
            const authValue = `Bearer ${config.current.AUTH_TOKEN}`;
            idServer.setAuthToken(authValue);
            arkQuota.setAuthToken(authValue);
            arkHost.setAuthToken(authValue);
        }
    }, [config.current]);

    return { idServer, arkQuota, arkHost };
};

export default useServicesClient;