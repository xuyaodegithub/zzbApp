import axios from 'axios';
// import Qs from 'qs'
import { Toast } from 'vant';
import { getCookie, setStore } from 'utils/storage';
import baseUrl from './baseurl';
import router from '../router';

const isAndroid = navigator.userAgent;
setStore('model', isAndroid);

const httpClient = axios.create();

// const CancelToken = axios.CancelToken;
// var cancel = null;
httpClient.defaults.withCredentials = true;
httpClient.defaults.timeout = 30000;
httpClient.interceptors.request.use(
  config => {
    const token = getCookie('Token');
    token && (config.headers.common['X-ZZD-AUTH'] = token);
    config.headers.common['X-ZZD-AGENT'] = isAndroid;
    // config.headers.post['Content-Type'] = 'application/json; charset=utf-8'
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

httpClient.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.resultCode === 119) {
      router.replace({
        path: '/login'
      });
      return Promise.reject(response);
    } else {
      return Promise.resolve(res);
    }
  },
  err => {
    if (!navigator.onLine) {
      Toast('网络异常，请查看你的网络状态');
      return 'networkdisconnect';
    }
    // 根据你设置的timeout/真的请求超时 判断请求现在超时了，你可以在这里加入超时的处理方案
    if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
      // return axios.request(originalRequest) // 再重复请求一次
      Toast('网络繁忙，请稍后重试');
      return 'timeout';
    }
    return Promise.reject(err.response);
  }
);

export default {
  post (url, params) {
    return httpClient({
      method: 'post',
      baseURL: baseUrl,
      url,
      data: params,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  },
  filepost (url, params) {
    return httpClient({
      method: 'post',
      baseURL: baseUrl,
      url,
      // cancelToken: new CancelToken(function exector (c) {
      //   cancel = c;
      // }),
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
