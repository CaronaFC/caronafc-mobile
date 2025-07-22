import axios, { AxiosResponse } from "axios";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";
import { api } from "../lib/api";
import { ForgotPasswordUserType, LoginResponseType, LoginUserType, RegisterResponseType, RegisterUserType, ResetPasswordUserType } from "../types/auth";


const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export async function registerUser(userData: RegisterUserType): Promise<RegisterResponseType> {
  try {
    const response = await api.post("/usuario", userData)
    console.log("response")
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      const message = error.response?.data?.message || "Erro na requisição"
      throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
    } else {
      throw new Error("Erro inesperado ao registrar usuário.");
    }
  }
}


export async function loginUser(userData: LoginUserType): Promise<AxiosResponse<LoginResponseType>> {
  try {
    const response = await api.post("/auth/login", userData)
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status == 401) {
        console.log("Credenciais inválidas")
        throw new Error(`Credenciais inválidas`);
      }
      const message = error.response?.data?.message || "Erro na requisição"
      throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
    } else {
      throw new Error("Erro inesperado ao registrar usuário.");
    }
  }
}
export async function forgotPasswordUser(userData: ForgotPasswordUserType): Promise<string> {
  try {
    const response = await api.post("/auth/forgot-password", userData);
    return response.data?.message ?? "Solicitação enviada com sucesso.";
  } catch (error: any) {
    console.error("Erro inesperado:", error);

    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;

      if (typeof msg === "string") return Promise.reject(new Error(msg));
      if (Array.isArray(msg)) return Promise.reject(new Error(msg.join("\n")));
      if (typeof msg === "object" && msg !== null)
        return Promise.reject(new Error(Object.values(msg).join("\n")));

      return Promise.reject(new Error(`Erro ${error.response?.status ?? "desconhecido"}`));
    }

    return Promise.reject(new Error("Erro inesperado ao enviar requisição."));
  }
}
export async function resetPasswordUser(userData: ResetPasswordUserType): Promise<string> {
  try {
    const response = await api.post("/auth/reset-password", userData);
    return response.data?.message ?? "Solicitação de reset enviada com sucesso.";
  } catch (error: any) {
    console.error("Erro inesperado:", error);

    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message;

      if (typeof msg === "string") return Promise.reject(new Error(msg));
      if (Array.isArray(msg)) return Promise.reject(new Error(msg.join("\n")));
      if (typeof msg === "object" && msg !== null)
        return Promise.reject(new Error(Object.values(msg).join("\n")));

      return Promise.reject(new Error(`Erro ${error.response?.status ?? "desconhecido"}`));
    }

    return Promise.reject(new Error("Erro inesperado ao alterar a senha."));
  }
}

export const useGoogleAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    native: "caronafcmobile://redirect", // <- corresponde ao scheme
    preferLocalhost: true, // Use localhost instead of IP in development
  });

  const clientId = Platform.select({
    android:"82:E2:2F:08:AD:88:92:65:A7:79:3C:7E:AE:72:53:C3:E3:90:DE:5F",
    web: "258403147124-2c323idi0iuetb6ld44jq784qt1o6s15.apps.googleusercontent.com",
    default: "258403147124-2c323idi0iuetb6ld44jq784qt1o6s15.apps.googleusercontent.com",
  })


const [request, response, promptAsync] = AuthSession.useAuthRequest(
  {
    clientId: clientId,
    redirectUri,
    scopes: ["openid", "profile", "email"],
  },
  discovery
);

const loginFirebase = async () => {
  console.log("request", request);
  const result = await promptAsync();
  console.log("result", result);
  if (result?.type === "success") {
    const idToken = result.params.id_token; // note o id_token
    const response = await api.post(`/auth/google`, { idToken });
    return response.data;
  }
  throw new Error('Login cancelado ou falhou');
  };
  return { loginFirebase, request,response };
}