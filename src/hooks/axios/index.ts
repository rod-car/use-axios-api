import axios from "axios";
const axiosClient = axios.create(/*{
    baseURL: baseUrl
}*/)

axiosClient.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer bearer-token`
    config.headers.Accept = ["application/json", "application/ld+json"]
    return config;
})

export default axiosClient;