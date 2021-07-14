import axios from "axios";
import authHeader from "./auth-header";
const url = 'http://localhost:8080/api/test';

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
}

export default new UserService();