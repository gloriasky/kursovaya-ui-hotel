import decode from 'jwt-decode';
import axios from 'axios';
import {routes} from "./routes";

const token_item = 'hub_token';
const user_item = 'hub_user';

export function login(token, user) {
    sessionStorage.setItem(token_item, token)
    sessionStorage.setItem(user_item, JSON.stringify(user))
}

export function logout() {
    sessionStorage.removeItem(token_item);
    sessionStorage.removeItem(user_item);
}

export function getToken() {
    return sessionStorage.getItem(token_item)
}

export function getUser() {
    return JSON.parse(sessionStorage.getItem(user_item))
}

export function createConfig() {
    const token = getToken();
    return token
        ? { headers: {'Authorization': 'Bearer ' + getToken()} }
        : {}
}

export function validatePermissions(permission){
    return axios.get(`${routes.validatePermission}?permission=${permission}`, createConfig())
}

export function loggedIn() {
    const token = getToken()
    return !!token && !isTokenExpired(token)
}

export function isTokenExpired(token) {
    try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            return true;
        }
        else
            return false;
    }
    catch (err) {
        return false;
    }
}

export function extractRedirect() {
    const params = new URLSearchParams(window.location.search);
    return params.has('redirectTo') ? params.get('redirectTo') : '/';
}

export function redirectToLogin() {
    return `/login?redirectTo=${window.location.pathname}`;
}
