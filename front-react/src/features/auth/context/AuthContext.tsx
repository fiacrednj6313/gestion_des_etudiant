import { createContext, useContext, useState, type ReactNode } from "react";
import type { PayloadType, User } from "../dtos/auth.dto";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthetificated: boolean;
}

// En dehors du composant AuthProvider
const getUserFromStorage = (): User | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode<PayloadType>(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("accessToken");
      return null;
    }

    return { id: decoded.id, nom: decoded.nom, email: decoded.email };
  } catch {
    localStorage.removeItem("accessToken");
    return null;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("L'utilisateur ne peut pas utiliser l'auth provider");

  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());

  console.log(user);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    const decoded = jwtDecode<PayloadType>(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthetificated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
