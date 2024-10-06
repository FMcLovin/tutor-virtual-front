import { API_URL } from "@env";

const makeRequest = async (
  method: string,
  endpoint: string,
  body?: any,
  token?: string,
) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    console.log(`${API_URL}/${endpoint}`);

    const response = await fetch(`${API_URL}/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => {
      throw new Error("La respuesta no es un JSON válido");
    });

    if (!response.ok) {
      const message =
        data?.message || `Error ${response.status}: ${response.statusText}`;
      throw new Error(message);
    }

    return data;
  } catch (error: any) {
    console.error(`Error en la petición ${method} ${endpoint}:`, error.message);
    throw error;
  }
};

export const get = async (endpoint: string, token?: string) => {
  return makeRequest("GET", endpoint, undefined, token);
};

export const post = async (endpoint: string, data: any, token?: string) => {
  return makeRequest("POST", endpoint, data, token);
};

export const put = async (endpoint: string, data: any, token?: string) => {
  return makeRequest("PUT", endpoint, data, token);
};

export const del = async (endpoint: string, token?: string) => {
  return makeRequest("DELETE", endpoint, undefined, token);
};
