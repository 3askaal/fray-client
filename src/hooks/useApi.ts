import { formatResponse } from "@/helpers"
import axios from 'axios';
import to from 'await-to-js';

export const useApi = () => {
  const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;

  const get = async (path: any) => {
    const [getError, getSuccess] = await to(
      axios.get(
        `${BASE_URL ? `${BASE_URL}/` : ''}${path}?populate=%2A`,
        {
          headers: {
            'Authorization': `bearer ${process.env.NEXT_PUBLIC_API_KEY}`
          }
        }
      )
    );

    if (getError) {
      throw getError
    }

    return formatResponse(getSuccess.data).data;
  }

  const post = async (path: any, payload: any) => {
    const [postError, postSuccess] = await to(
      axios.post(
        `${BASE_URL}/${path}`,
        payload,
        {
          headers: {
            'Authorization': `bearer ${process.env.NEXT_PUBLIC_API_KEY}`
          }
        }
      )
    );

    if (postError) {
      throw postError
    }

    return formatResponse(postSuccess.data).data;
  }

  return {
    BASE_URL,
    get,
    post,
  }
}
