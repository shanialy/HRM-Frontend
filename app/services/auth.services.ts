

import { postRequest } from "./api";

export interface LoginResponse {
    status: number;
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            _id: string;
            email: string;
            role: string;
            firstName: string;
            lastName: string;
        };
    };
}

export const loginUser = (payload: {
    email: string;
    password: string;
}) => {
    return postRequest<LoginResponse>("/authorization/login", payload);
};
