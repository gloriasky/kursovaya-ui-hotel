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
    addService: `${url}/add/service`,
    getService: `${url}/get/service`,
    updateService: `${url}/update/service`,
    deleteService: `${url}/delete/service`,
    getServices:`${url}/services`,
    validatePermission: `${url}/validate_permission`,
    uploadImage: `${url}/upload/image`,
    getImage: `${url}/get/image`
};
