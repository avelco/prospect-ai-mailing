// src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import api from '../services/axios';
import { User } from '../interfaces/UserInterface';

interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type:   string;
    expires:      Date;
    user:         User;
}


const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', payload.username);
    formData.append('password', payload.password);

    const response = await api.post<LoginResponse>(
        '/auth/token',
        formData,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
    return response.data;
};

export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    });
};
