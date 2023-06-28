import { createContext, useState, useContext, useMemo } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [success, setSuccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const reset = () => {
    setSuccess(true);
    setIsAdmin(false);
    setIsUser(false);
    setUserInfo({});
  };

  const context = useMemo(
    () => ({
      success,
      setSuccess,
      isAdmin,
      setIsAdmin,
      userInfo,
      isUser,
      setUserInfo,
      setIsUser,
      reset,
    }),
    [success, setSuccess, isAdmin, setIsAdmin, userInfo, setUserInfo, reset]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth, AuthContext };

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
