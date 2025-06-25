export type UserType = {
    data: {
        id: number;
        nome_completo: string;
        email: string;
        numero: string;
        cpf: string;
        senha: string;
        imagem: string | null;
        data_nascimento: string | null;
        data_criacao: string;
        veiculos: any[];
    };
    message: string;
};
