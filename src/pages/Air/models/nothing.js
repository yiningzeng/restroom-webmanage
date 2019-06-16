import { statistic, getList, getFuckGasInfo } from '@/services/nothing';

export default {
  namespace: 'nothing',

  state: {
    statistic: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    statisticList: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    fuckGasInfo: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    }
  },

  effects: {
    *getStatistic({ payload,callback}, { call, put }) {
      const response = yield call(statistic,payload);
      yield put({
        type: 'statistic',
        payload: response,
      });
      if (callback)callback(response);
    },
    *getStatisticList({ payload,callback}, { call, put }) {
      const response = yield call(getList,payload);
      yield put({
        type: 'statisticList',
        payload: response,
      });
      if (callback)callback(response);
    },
    *getFuckGasInfoQuery({ payload,callback}, { call, put }) {
      const response = yield call(getFuckGasInfo,payload);
      yield put({
        type: 'fuckGasInfo',
        payload: response,
      });
      if (callback)callback(response);
    },
  },

  reducers: {
    statistic(state, action) {
      return {
        ...state,
        statistic: action.payload,
      };
    },
    statisticList(state, action) {
      return {
        ...state,
        statisticList: action.payload,
      };
    },
    fuckGasInfo(state, action) {
      return {
        ...state,
        fuckGasInfo: action.payload,
      };
    },
  },
};
