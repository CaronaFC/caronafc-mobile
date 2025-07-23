import axios, { AxiosResponse } from "axios";
import { api } from "../lib/api"
import { LoginResponseType, LoginUserType, RegisterResponseType, RegisterUserType,ForgotPasswordUserType,ResetPasswordUserType, UpdateUserType } from "../types/auth";


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

export async function updateUser(userData: UpdateUserType): Promise<any> {
  try {
    const { id, ...rest } = userData;
    const response = await api.patch(`/usuario/${id}`, rest);
    return response.data ?? "Usuário atualizado com sucesso.";
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

    return Promise.reject(new Error("Erro inesperado ao alterar dados do usuario"));
  }
}