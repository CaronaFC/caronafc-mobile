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

export type LoginUserType = {
    identificador: string, // pode ser o email ou o número
    senha: string,
}

export type LoginResponseType = {
    id: Number,
    token: string,
}

export type ForgotPasswordUserType = {
    email: string, // pode ser o email ou o número
}

export type ForgotPasswordUserResponseType = {
    id: Number,
}