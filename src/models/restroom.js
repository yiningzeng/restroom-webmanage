import { query,addRestRoom,updateRestRoom,deleteRestRoom,getWeather, getFuckFlow } from '@/services/restroom';

export default {
  namespace: 'restroom',

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
    fuckFlow: {
      code: undefined,
      status: 0,
      msg: '',
      data: [],
    },
  },

  effects: {
    *weather({ callback}, { call, put }) {
      const response = yield call(getWeather);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *fetch({ payload,callback}, { call, put }) {
      const response = yield call(query,payload);
      yield put({
        type: 'list',
        payload: response,
      });
      if (callback)callback(response);
    },

    *getFuckFlow({ payload,callback}, { call, put }) {
      const response = yield call(getFuckFlow,payload);
      yield put({
        type: 'fuckFlow',
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
    *updateRestRoom({ payload,callback}, { call, put }) {
      const response = yield call(updateRestRoom,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *deleteRestRoom({ payload,callback}, { call, put }) {
      const response = yield call(deleteRestRoom,payload);
      yield put({
        type: 'del',
        payload: response,
      });
      if (callback)callback(response);
    },
  },

  reducers: {
    del(state, action) {
      return {
        ...state,
        del: action.payload,
      };
    },
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
    fuckFlow(state, action) {
      return {
        ...state,
        fuckFlow: action.payload,
      };
    },
  },
};
