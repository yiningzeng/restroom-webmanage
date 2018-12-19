import { query,addRestRoom  } from '@/services/restroom';

export default {
  namespace: 'restroom',

  state: {
    res: {
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
        type: 'res',
        payload: response,
      });
      if (callback)callback();
    },
    *addRestRoom({ payload,callback}, { call, put }) {
      const response = yield call(addRestRoom,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback();
    },
  },

  reducers: {
    res(state, action) {
      return {
        ...state,
        res: action.payload,
      };
    },
  },
};
