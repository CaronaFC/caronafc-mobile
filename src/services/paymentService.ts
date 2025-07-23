import { api } from '../lib/api';
import { AddressType, PassengerTypePayment } from '../types/passanger';

export interface PaymentData {
  viagemId?: number;
  description: string;
  paymentMethod: string;
  notificationUrl: string;
  usuario: PassengerTypePayment;
  address?: AddressType; // Optional, if needed
  valor: string;
}

export interface PaymentResponse {
  id: number;
  status: string;
  pixUrl?: string;
  pixCode?: string;
}

export async function createPayment(paymentData: any): Promise<any> {
  try {
    const response = await api.post('/pagamentos/post', paymentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao criar pagamento.");
  }
}

export async function getPaymentById(paymentId: string): Promise<any> {
  try {
    const response = await api.get(`/paymentos/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao buscar pagamento.");
  }
};

export const cancelPayment = async (paymentId: number): Promise<void> => {
  try {
    await api.post(`/payments/${paymentId}/cancel`);
  } catch (error: any) {
    console.error('Erro ao cancelar pagamento:', error);
    throw new Error(error.response?.data?.message || 'Erro ao cancelar pagamento');
  }
};