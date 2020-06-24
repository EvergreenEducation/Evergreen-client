import { reactLocalStorage } from 'reactjs-localstorage';

class AuthService {
  constructor() {
    this.authenticated = false;
    this.currentSession = {
      user_id: null,
    };
  }

  setCurrentSession = (currentSession) => {
    reactLocalStorage.setObject('currentSession', currentSession);
    this.currentSession = currentSession;
    if (currentSession.id) {
      this.setAuthenticated();
    }
  };

  setAuthenticated = () => {
    this.authenticated = true;
  };
  setNotAuthenticated = () => {
    this.authenticated = false;
  };

  logout = () => {
    reactLocalStorage.remove('currentSession');
    this.setNotAuthenticated();
    this.currentSession = { user_id: null };
    window.location.replace(`${process.env.REACT_APP_API_URL}/logout`);
    return null;
  };
}

export default new AuthService();
