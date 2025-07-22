import { api } from '../lib/api';

export interface PaymentData {
  travelId: number;
  passengerId: number;
  paymentMethod: string;
  amount: number;
  serviceFee: number;
  total: number;
}

export interface PaymentResponse {
  id: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  paymentUrl?: string; // Para PIX ou outros métodos que precisam de redirecionamento
  qrCode?: string; // Para PIX
  message: string;
}

export async function createPayment(paymentData: any): Promise<any> {
  try {
    const response = await api.post('/pagamento', paymentData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Erro inesperado ao criar pagamento.");
  }
}

export const confirmPayment = async (paymentId: number): Promise<PaymentResponse> => {
  try {
    const response = await api.post(`/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao confirmar pagamento:', error);
    throw new Error(error.response?.data?.message || 'Erro ao confirmar pagamento');
  }
};

export async function getPaymentById(paymentId: string): Promise<any> {
  try {
    const response = await api.get(`/pagamento/${paymentId}`);
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