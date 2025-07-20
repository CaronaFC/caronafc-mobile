import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserById } from "../services/userService";
import { LoginResponseType } from "../types/auth";
import { setAccessToken } from "../lib/token";
import { UserType } from "../types/user";

type AuthContextType = {
  userData: UserType | null;
  login: (userInfo: LoginResponseType) => Promise<void>;
  logout: () => void;
  isLoading: false | true;
  userToken: null | string;
  refreshUserData: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  const login = async (userPayload: LoginResponseType) => {
    setIsLoading(true);
    setUserToken(userPayload.token);

    setAccessToken(userPayload.token);
    const response = await getUserById(userPayload.id);
    const user = await response.data;
    AsyncStorage.setItem("userToken", userPayload.token);
    AsyncStorage.setItem("userInfo", JSON.stringify(user));
    setUserData(user);
    setIsLoading(false);
  };
  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    setUserData(null);
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userInfo");

    setIsLoading(false);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);

      const userToken = await AsyncStorage.getItem("userToken");
      const userInfoRaw = await AsyncStorage.getItem("userInfo");

      if (userInfoRaw) {
        const userInfo = JSON.parse(userInfoRaw) as UserType;
        console.log("userINfo", userInfo);
        setUserToken(userToken ?? "");
        setUserData(userInfo);
      }

      setIsLoading(false);
    } catch (error) {
      console.log("IsLogged in error", error);
    }
  };

  const refreshUserData = async () => {
    setIsLoading(true);
    const response = await getUserById(userData!.data.id);
    const user = await response.data;
    AsyncStorage.setItem("userInfo", JSON.stringify(user));
    setUserData(user);
    setIsLoading(false);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userData, login, logout, isLoading, userToken, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
