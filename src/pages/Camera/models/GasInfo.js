import { queryGasInfo } from '@/services/gas';

export default {
  namespace: 'gasinfo',

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
      const response = yield call(queryGasInfo,payload);
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
  },
};
