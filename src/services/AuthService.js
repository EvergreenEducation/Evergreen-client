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
    logout = () => {
      this.authenticated = false;
      this.currentSession = { user_id: null };
      window.location.replace(`${process.env.REACT_APP_API_URL}/logout`)
      return null;
    }
}

export default new AuthService();
