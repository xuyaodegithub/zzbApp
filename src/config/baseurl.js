let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  baseUrl = '/api';
} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = ''; // window.location.origin
  baseUrl = 'http://47.100.255.58'; // window.location.origin
}

export default baseUrl;
