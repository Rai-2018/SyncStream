import axios from "axios";
const API_URL = `http://${process.env.REACT_APP_URL}:4000/api/auth/`;

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