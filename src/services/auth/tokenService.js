const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Access tokenni localStorage'ga saqlash
export const saveAccessToken = (token) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

// Access tokenni localStorage'dan olish
export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Refresh tokenni localStorage'ga saqlash
export const saveRefreshToken = (token) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

// Refresh tokenni localStorage'dan olish
export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Tokenlarni localStorage'dan o'chirish
export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};