import {properties} from "./properties";

const url = `${properties.apiUrl}/api`;

export const routes = {
    login: `${url}/login`,
    createUser: `${url}/user`
};
