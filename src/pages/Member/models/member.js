import { query,add,resetPass,del } from '@/services/member';

export default {
  namespace: 'member',

  state: {
    del: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    res: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    list: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
  },

  effects: {
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(query,payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback)callback(response);
    },
    *addUser({ payload,callback}, { call, put }) {
      const response = yield call(add,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *resetPass({ payload,callback}, { call, put }) {
      const response = yield call(resetPass,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *deleteUser({ payload,callback}, { call, put }) {
      const response = yield call(del,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
  },

  reducers: {
    res(state, action) {
      return {
        ...state,
        res: action.payload,
      };
    },
    list(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
