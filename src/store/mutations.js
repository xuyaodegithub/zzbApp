import { AUTHSTATUS } from './mutations-types';

export default {
  [AUTHSTATUS] (state, value) {
    state.authStatus = value;
  }
};
