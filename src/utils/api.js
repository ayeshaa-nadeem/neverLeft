import axios from "axios";
import { getToken } from "./localStorage";

const backEndURLWithAuth = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: "https://api-dev.neverleft.co.uk/api",
  headers: {
    Authorization: `Bearer ${getToken("access_token")}`,
  },
});

const backEndURLWithoutAuth = axios.create({
  // baseURL: process.env.REACT_APP_BASE_URL,
  baseURL: "https://api-dev.neverleft.co.uk/api",
});

export const postApiWithoutAuth = async (url, body) => {
  try {
    const result = await backEndURLWithoutAuth.post(url, body);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateApiWithAuth = async (url, body) => {
  backEndURLWithAuth.interceptors.request.use((config) => {
    return config;
  });
  try {
    const result = await backEndURLWithAuth.patch(url, body);
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const deleteApiWithAuth = async (url) => {
  backEndURLWithAuth.interceptors.request.use((config) => {
    let token = getToken("access_token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  });
  try {
    const result = await backEndURLWithAuth.delete(url);
    return result;
  } catch (error) {
    return error.response.data;
  }
};

export const getApiWithAuth = async (url) => {
  backEndURLWithAuth.interceptors.request.use((config) => {
    let token = getToken("access_token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  });
  try {
    const result = await backEndURLWithAuth.get(url);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};

export const postApiWithAuth = async (url, body, addParam) => {
  backEndURLWithAuth.interceptors.request.use((config) => {
    let token = getToken("access_token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  });
  try {
    const result = await backEndURLWithAuth.post(url, body, addParam);
    return result.data;
  } catch (error) {
    return error.response?.data.message;
  }
};

export const patchApiWithAuth = async (url, body) => {
  backEndURLWithAuth.interceptors.request.use((config) => {
    let token = getToken("access_token");
    config.headers["Authorization"] = "Bearer " + token;
    return config;
  });
  try {
    const result = await backEndURLWithAuth.patch(url, body);
    return result.data;
  } catch (error) {
    return error.response.data;
  }
};
export const createFormDataObject = (formInputData) => {
  const formData = new FormData();
  for (const key in formInputData) {
    formData.append(key, formInputData[key]);
  }
  return formData;
};
