import {properties} from "./properties";

const url = `${properties.apiUrl}/api`;

export const routes = {
    login: `${url}/login`,
    createUser: `${url}/user`,
    getRooms:`${url}/rooms`,
    validatePermission: `${url}/validate_permission`
};
