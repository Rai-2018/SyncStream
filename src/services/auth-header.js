export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    // checks local storage for user item
    if(user && user.accessToken) {  // if user logged in with jwt, return http authorization header
        return { Authorization: 'Bearer ' + user.accessToken};
    } else {
        return {};
    }
}