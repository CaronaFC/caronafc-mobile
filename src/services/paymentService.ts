import { api } from '../lib/api';

export async function createPayment(paymentData: any): Promise<any> {
  try {
    const response = await api.post('/pagamento', paymentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao criar pagamento.");
  }
}

export async function getPaymentById(paymentId: string): Promise<any> {
  try {
    const response = await api.get(`/pagamento/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao buscar pagamento.");
  }
}