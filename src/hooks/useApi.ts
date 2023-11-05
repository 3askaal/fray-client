import useAxios from 'axios-hooks';
import { formatResponse } from "@/helpers"
import axios from 'axios';

export const useApi = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const get = async (path: any) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${path}?populate=%2A`);

      return formatResponse(data).data;
    } catch (err) {
      throw err
    }
  }

  const post = async (path: any, payload: any) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/${path}`, payload);

      return formatResponse(data);
    } catch (err) {
      throw err
    }
  }

  return {
    BASE_URL,
    get,
    post,
  }
}
