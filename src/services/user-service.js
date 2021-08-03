import axios from "axios";
import authHeader from "./auth-header";

const url = `http://${process.env.REACT_APP_URL}:4000/api/test/`;

class UserService {
    getPublicContent() {
        return axios.get(url + 'all');
    }

    getUserBoard() {
        return axios.get(url + 'user', { headers: authHeader() });
    }

    getModeratorBoard() {
        return axios.get(url + 'mod', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(url + 'admin', { headers: authHeader() });
    }

    getAll(){
        const requestOptions = { method: 'GET', headers: authHeader() };
        return axios.fetch(url + 'users', requestOptions);
    }

    getById(id){
        const requestOptions = { method: 'GET', headers: authHeader() };
        return axios.fetch(url + 'users' + `${id}`, requestOptions);
    }
}

export default new UserService();