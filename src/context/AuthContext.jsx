import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [tokenPublico, setTokenPublico] = useState(
    localStorage.getItem("tokenPublico") || ""
  );

  const guardarTokenPublico = (token) => {
    setTokenPublico(token);
    localStorage.setItem("tokenPublico", token);
  };

  const limpiarTokenPublico = () => {
    setTokenPublico("");
    localStorage.removeItem("tokenPublico");
  };

  return (
    <AuthContext.Provider
      value={{ tokenPublico, guardarTokenPublico, limpiarTokenPublico }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}