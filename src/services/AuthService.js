import {reactLocalStorage} from 'reactjs-localstorage';

class AuthService {
    constructor() {
      this.authenticated = false;
      this.currentSession = {
        user_id: null
      }
    }

    setCurrentSession = (currentSession) => { 
      reactLocalStorage.setObject('currentSession', currentSession);
      this.currentSession = currentSession;

      this.isAuthenticated = true;
    }

    setAuthenticated = () => (this.authenticated = true);
    setNotAuthenticated = () => (this.authenticated = true);
    isAuthenticated = () => this.authenticated;

    logout = () => {
      reactLocalStorage.remove('currentSession');
      this.authenticated = false;
      this.currentSession = { user_id: null };
      window.location.replace(`${process.env.REACT_APP_API_URL}/logout`)
      return null;
    }
}

export default new AuthService();
