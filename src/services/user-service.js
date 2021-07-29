import axios from "axios";
import authHeader from "./auth-header";
const url = 'http://34.152.45.178:4000/api/test';

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