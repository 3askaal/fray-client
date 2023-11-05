import useAxios from 'axios-hooks';
import { formatResponse } from "@/helpers"
import axios from 'axios';

export const useApi = () => {
  const API_URL = process.env.nodeEnv === 'dev' ? process.env.apiBaseUrl : ''

  const get = async (path: any) => {
    try {
      const { data } = await axios.get(`${API_URL}/${path}?populate=%2A`);

      return formatResponse(data).data;
    } catch (err) {
      throw err
    }
  }

  const post = async (path: any, payload: any) => {
    try {
      const { data } = await axios.post(`${API_URL}/${path}`, payload);

      return formatResponse(data);
    } catch (err) {
      throw err
    }
  }

  return {
    get,
    post,
  }
}
