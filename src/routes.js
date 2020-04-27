import {properties} from "./properties";

const url = `${properties.apiUrl}/api`;

export const routes = {
    login: `${url}/login`,
    createUser: `${url}/user`,
    addRoom: `${url}/add/room`,
    getRoom: `${url}/get/room`,
    updateRoom: `${url}/update/room`,
    deleteRoom: `${url}/delete/room`,
    getRooms:`${url}/rooms`,
    validatePermission: `${url}/validate_permission`
};
