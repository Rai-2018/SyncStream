import axios from "axios";
import authHeader from "./auth-header";
const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    login(username, password) { 
        return axios
            .post(API_URL + "signin", { // post username and password
                username,
                password
            })
            .then(response => {
                if(response.data.accessToken) { // save jwt to local storage
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(username, email, password) {
        return axios.post(API_URL + 'register', {
            username, email, password
        });
    }

    getCurrentUser(){
        return JSON.parse(localStorage.getItem('user'));;
    }
}

export default new AuthService();