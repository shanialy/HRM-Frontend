import { postRequest } from "./api";


export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: {
        _id: string;
        email: string;
        role: string;
    };
    token: string;
}

export const loginUser = (data: LoginPayload) => {
    return postRequest<LoginResponse>("/authorization/login", data);
};
