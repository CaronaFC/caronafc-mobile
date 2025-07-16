import axios, { AxiosResponse } from "axios";
import { api } from "../lib/api"
import { LoginResponseType, LoginUserType, RegisterResponseType, RegisterUserType,ForgotPasswordUserResponseType,ForgotPasswordUserType } from "../types/auth";


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
export async function forgotPasswordUser(userData: ForgotPasswordUserType): Promise<AxiosResponse<ForgotPasswordUserResponseType>> {
    try {
        const response = await api.post("/auth/forgot-password", userData);

        if (response?.data?.message) {
        return response.data.message;
        }
        return response.data;
    } catch (error:any) {
        console.error("Erro inesperado:", error);
        console.error("AxiosError?", axios.isAxiosError(error));
        console.error("Error.response:", error?.response);
        if (axios.isAxiosError(error)) {
            const status = error.response?.status
            if (status == 401) {
                console.log("Credenciais inválidas")
                throw new Error(`Credenciais inválidas`);
            }
            if (status == 200) {
                console.log("ok")
                throw new Error(`ok`);
            }
            const message = error.response?.data?.message
            throw new Error(`Erro ${status ?? "desconhecido"}: ${message}`);
        } else {
            throw new Error("Erro inesperado ao registrar usuário.");
        }
    }
}