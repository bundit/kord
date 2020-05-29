import React, { useState } from "react";

const defaultState = { isLoggedIn: false };

export const authContext = React.createContext(defaultState);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  React.useEffect(() => {
    fetch("/auth/token").then(res => {
      if (res.status === 200) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <authContext.Provider value={{ isLoggedIn }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthDetection = () => {
  const { isLoggedIn } = React.useContext(authContext);
  return isLoggedIn;
};

export default ({ element }) => <AuthProvider>{element}</AuthProvider>;
