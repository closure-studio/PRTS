import { IServiceConfigs } from "../types/axios";

const CLARITY_WEB_PROD_ID = "t0xwcydiwk";
const CLARITY_WEB_PREVIEW_ID = "t0eivofjdb";
const CLARITY_NATIVE_PROD_ID = "t0eiarz3dw";
const CLARITY_NATIVE_PREVIEW_ID = "syvx7716cr";

interface IConstants {
  CLARITY: {
    WEB_PREVIEW_ID: string;
    WEB_PROD_ID: string;
    NATIVE_PREVIEW_ID: string;
    NATIVE_PROD_ID: string;
  };
  SERVICE_CONFIGS: IServiceConfigs;
}

export const CONSTANTS: IConstants = {
  CLARITY: {
    WEB_PREVIEW_ID: CLARITY_WEB_PREVIEW_ID,
    WEB_PROD_ID: CLARITY_WEB_PROD_ID,
    NATIVE_PREVIEW_ID: CLARITY_NATIVE_PREVIEW_ID,
    NATIVE_PROD_ID: CLARITY_NATIVE_PROD_ID,
  },
  SERVICE_CONFIGS: {
    ARK_HOST: {
      HOST: `https://api-tunnel.arknights.app`
    },
    ARK_QUOTA: {
      HOST: `https://registry.ltsc.vip`
    },
    ID_SERVER: {
      HOST: `https://passport.ltsc.vip`
    },
    AUTH_TOKEN: "",
  },
} as const;
