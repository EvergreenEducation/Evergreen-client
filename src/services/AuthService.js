class AuthService {
    constructor() {
      this.authenticated = false;
      this.currentSession = {
        user_id: null
      }
    }

    setCurrentSession = (currentSession) => { this.currentSession = currentSession }

    setAuthenticated = () => (this.authenticated = true);

    setNotAuthenticated = () => (this.authenticated = true);
    isAuthenticated = () => this.authenticated;
}

export default new AuthService();
