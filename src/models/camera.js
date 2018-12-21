import { query,addRestRoom  } from '@/services/restroom';

export default {
  namespace: 'camera',

  state: {
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
    *addRestRoom({ payload,callback}, { call, put }) {
      const response = yield call(addRestRoom,payload);
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
