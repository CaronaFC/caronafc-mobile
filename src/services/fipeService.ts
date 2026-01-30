import axios from 'axios';

const FIPE_API = 'https://parallelum.com.br/fipe/api/v2';

const fipeApi = axios.create({
  baseURL: FIPE_API,
  timeout: 5000,
});

export async function getFipeBrands(type: String) {
  const response = await fipeApi.get(`/${type}/brands`);
  return response.data;
}

export async function getFipeModels(type: String, brandId: string) {
  const response = await fipeApi.get(`/${type}/brands/${brandId}/models`);
  return response.data;
}