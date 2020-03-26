class AuthService {
    constructor() {
        this.authenticated = false;
    }

    setAuthenticated = () => (this.authenticated = true);

    setNotAuthenticated = () => (this.authenticated = true);

    isAuthenticated = () => this.authenticated;
}

export default new AuthService();
