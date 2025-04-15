const Auth = {
    login: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
    },
    logout: () => {
      localStorage.removeItem("user");
    },
    isAuthenticated: () => {
      return !!localStorage.getItem("user");
    },
  };
  
  export default Auth;
  