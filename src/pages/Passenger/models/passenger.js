import { onlyGetFuckFlow, getOnlyFuckFlowByWeek, getOnlyFuckFlowByMonth } from '@/services/passenger';

export default {
  namespace: 'passenger',

  state: {
    onlyFuckFlow: {
      code: undefined,
      status: undefined,
      msg: '',
      data: {},
    },
    onlyFuckFlowWeek: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    onlyFuckFlowMonth: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    res: {
      code: undefined,
      status: undefined,
      msg: '',
      data: {},
    },
    list: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
  },

  effects: {
    *onlyGetFuckFlow({ payload,callback}, { call, put }) {
      const response = yield call(onlyGetFuckFlow,payload);
      yield put({
        type: 'onlyFuckFlow',
        payload: response,
      });
      if (callback)callback(response);
    },
    *getOnlyFuckFlowByWeek({ payload,callback}, { call, put }) {
      const response = yield call(getOnlyFuckFlowByWeek,payload);
      yield put({
        type: 'onlyFuckFlowWeek',
        payload: response,
      });
      if (callback)callback(response);
    },
    *getOnlyFuckFlowByMonth({ payload,callback}, { call, put }) {
      const response = yield call(getOnlyFuckFlowByMonth,payload);
      yield put({
        type: 'onlyFuckFlowMonth',
        payload: response,
      });
      if (callback)callback(response);
    },
  },

  reducers: {
    onlyFuckFlow(state, action) {
      return {
        ...state,
        onlyFuckFlow: action.payload,
      };
    },
    onlyFuckFlowWeek(state, action) {
      return {
        ...state,
        onlyFuckFlowWeek: action.payload,
      };
    },
    onlyFuckFlowMonth(state, action) {
      return {
        ...state,
        onlyFuckFlowMonth: action.payload,
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
  },
};
