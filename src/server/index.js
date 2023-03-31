import axios from "axios";

export const MainApi = "http://192.168.0.121/v1";

const instance = axios.create({
    baseURL: `${MainApi}`,
});

export const userLogouts = async () => {
    // await AsyncStorage.clear()
}
  export const setStoreToken = (value) => {
    localStorage.setItem('token', value);
  }
  export const removeToken = async (value) => {
      
    }
  export const getStoreToken =  () => {
      const token = localStorage.getItem("token")
      if(token) {
        return token
      }
      return "";
  }

instance.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  config.headers = {
    ...config.headers,
    "Accept": "*",
    "Content-Type": "application/json",
    "lang": "uz"
  };

  return config;
}, error => Promise.reject(error.response));

instance.interceptors.response.use(response =>{
  // console.log("config  response", response);
  return response?.data
}, async error => {
  if(error.response?.data?.code === 401) {
    // store.dispatch({ type: USERAUTH.LOGINLOGOUT })
    // await userLogouts()
  }
    return Promise.reject(error.response?.data)
});

export default instance;