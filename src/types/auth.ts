export type RegisterUserType = {
    nome_completo: string,
    email: string,
    numero: string,
    cpf: string,
    senha: string,
}

export type RegisterResponseType = {
    message: string,
    userId?: string,
}