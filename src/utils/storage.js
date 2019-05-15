const setStore = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
};

const getStore = name => {
  if (!name) return;
  return window.localStorage.getItem(name);
};

const removeStore = name => {
  if (!name) return;
  window.localStorage.removeItem(name);
};

const setCookie = (name, cvalue, clearDay = 7) => {
  const d = new Date();
  d.setTime(d.getTime() + Number(clearDay) * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  const value = encodeURI(cvalue);
  document.cookie = name + '=' + value + ';' + expires;
};

const getCookie = name => {
  const cname = name + '=';
  var carr = document.cookie.split(';');
  for (let i = 0; i < carr.length; i++) {
    let cvalue = carr[i];
    while (cvalue.charAt(0) === ' ') cvalue = cvalue.substring(1);
    if (cvalue.indexOf(cname) !== -1) {
      return decodeURI(cvalue.substring(cname.length, cvalue.length));
    }
  }
};

const clearCookie = name => {
  setCookie(name, '', -1);
};
export { setStore, getStore, removeStore, setCookie, clearCookie, getCookie };
