import api from '../api'
import { saveAccessToken, saveRefreshToken, clearTokens } from './tokenService';

// Login qilish
export const login = async (username, password) => {
    const response = await api.post('/users/token/', { username, password });
    const { access, refresh } = response.data;
    // Tokenlarni saqlash
    saveAccessToken(access);
    saveRefreshToken(refresh);
    return response.data;
}

export const getUser = async () => {
    const response = await api.get('/users/me/');
    return response.data;
};

// Token yangilash
export const refreshToken = async (refreshToken) => {
    const response = await api.post('/users/token-refresh/', { refresh: refreshToken });
    const { access } = response.data;
    // Yangi access tokenni saqlash
    saveAccessToken(access);
    return response.data;
}

// Logout qilish
export const logout = async () => {
    clearTokens();
};
