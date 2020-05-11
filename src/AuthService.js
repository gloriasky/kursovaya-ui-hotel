import decode from 'jwt-decode';
import axios from 'axios';
import {routes} from "./routes";
import * as _ from "lodash";

const token_item = 'hub_token';
const user_item = 'hub_user';
const room_item = 'room_id';
const from_item = 'from_id';
const to_item = 'to_id';
const booking_item = 'booking_id';

export function login(token, user) {
    sessionStorage.setItem(token_item, token);
    sessionStorage.setItem(user_item, JSON.stringify(user))
}

export function saveBookingId(bookingId) {
    sessionStorage.setItem(booking_item, bookingId);
}

export function getBookingId() {
    return sessionStorage.getItem(booking_item)
}

export function saveBookingInfo(roomId, from, to) {
    sessionStorage.setItem(room_item, roomId);
    sessionStorage.setItem(from_item, from);
    sessionStorage.setItem(to_item, to)
}

export function getRoomId() {
    return sessionStorage.getItem(room_item)
}

export function getFrom() {
    return sessionStorage.getItem(from_item)
}

export function getTo() {
    return sessionStorage.getItem(to_item)
}

export function logout() {
    sessionStorage.removeItem(token_item);
    sessionStorage.removeItem(user_item);
    sessionStorage.removeItem(room_item);
    sessionStorage.removeItem(to_item);
    sessionStorage.removeItem(from_item);
    sessionStorage.removeItem(booking_item);
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
        return decoded.exp < Date.now() / 1000;
    }
    catch (err) {
        return false;
    }
}

export function getDateDifference(dateFrom, dateTo) {
    let _dateFrom = new Date(dateFrom);
    let _dateTo = new Date(dateTo);
    const diffTime = Math.abs(_dateFrom - _dateTo);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function  beautifyKey(key){
    return _.capitalize(_.upperCase(key))
}

export function extractRedirect() {
    const params = new URLSearchParams(window.location.search);
    return params.has('redirectTo') ? params.get('redirectTo') : '/';
}

export function redirectToLogin() {
    return `/login?redirectTo=${window.location.pathname}`;
}
