

export interface IAuthLoginRequest {
    email: string;
    password: string;
}

export interface IAuthLoginResponse {
    token: string;
    available_slot: number; // deprecated
}

export interface IAuthInfo {
    createdAt: number;
    email: string;
    exp: number;
    isAdmin: boolean;
    permission: number;
    status: number;
    uuid: string;
}