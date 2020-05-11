import {properties} from "./properties";

const url = `${properties.apiUrl}/api`;

export const routes = {
    login: `${url}/login`,
    addGuest: `${url}/user`,
    getGuest: `${url}/get/guest`,
    getGuests:`${url}/guests`,
    addRoom: `${url}/add/room`,
    getRoom: `${url}/get/room`,
    updateRoom: `${url}/update/room`,
    deleteRoom: `${url}/delete/room`,
    getRooms:`${url}/rooms`,
    getAvailableRooms: `${url}/rooms/available`,
    addService: `${url}/add/service`,
    getService: `${url}/get/service`,
    updateService: `${url}/update/service`,
    deleteService: `${url}/delete/service`,
    getServices:`${url}/services`,
    validatePermission: `${url}/validate_permission`,
    uploadImage: `${url}/upload/image`,
    getImage: `${url}/get/image`,
    getEmployees: `${url}/employees`,
    updateEmployee: `${url}/update/employee`,
    addEmployee: `${url}/add/employee`,
    getEmployee: `${url}/get/employee`, 
    deleteEmployee: `${url}/delete/employee`,
    saveBooking: `${url}/save/booking`,
    getUserBookings: `${url}/user/bookings`,
    updateBooking: `${url}/update/booking`,
    getUserBooking: `${url}/user/booking`,
    getAllBookings: `${url}/bookings`
};
