import { setStore } from './storage';
// 存储用户信息
const setStorePersonalInfo = (name, mobile, idNum, orderId) => {
  setStore('name', name);
  setStore('mobile', mobile);
  setStore('idNum', idNum);
  setStore('orderId', orderId);
};

export {
  setStorePersonalInfo
};
