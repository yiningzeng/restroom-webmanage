import { query as queryCamera,add as addCamera,del as deleteCamera,push as pushStream,stop as stopStream} from '@/services/camera';
import { query as queryGas,add as addGas,del as deleteGas,queryHomeGasList } from '@/services/gas';
import { getFuckGasInfo } from '@/services/nothing';

export default {
  namespace: 'device',

  state: {
    res: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    deviceList: {
      code: undefined,
      status: undefined,
      msg: '',
      data: [],
    },
    gasFlow: {
      code: undefined,
      status: undefined,
      msg: '',
      data: {},
    },
  },

  effects: {
    *fetch({deviceType, payload,callback}, { call, put }) {
      let response;
      switch (deviceType) {
        case "camera":
          response= yield call(queryCamera,payload);
          break;
        case "board":
          response= yield call(queryCamera,payload);
          break;
        case "gas":
          response= yield call(queryGas,payload);
          break;
      }
      yield put({
        type: 'deviceList',
        payload: response,
      });
      if (callback)callback(response);
    },
    *pushStream({ payload,callback}, { call, put }) {
      const response = yield call(pushStream,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *stopStream({ payload,callback}, { call, put }) {
      const response = yield call(stopStream,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *addCamera({ payload,callback}, { call, put }) {
      const response = yield call(addCamera,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *deleteCamera({ payload,callback}, { call, put }) {
      const response = yield call(deleteCamera,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },

    *addGas({ payload,callback}, { call, put }) {
      const response = yield call(addGas,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },
    *queryHomeGasList({ payload,callback}, { call, put }) {
      const response = yield call(queryHomeGasList,payload);
      yield put({
        type: 'gasFlow',
        payload: response,
      });
      if (callback)callback(response);
    },
    *deleteGas({ payload,callback}, { call, put }) {
      const response = yield call(deleteGas,payload);
      yield put({
        type: 'res',
        payload: response,
      });
      if (callback)callback(response);
    },

    *searchDeviceStatus({ payload,callback}, { call, put }) {
      const response = yield call(getFuckGasInfo,payload);
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
    deviceList(state, action) {
      return {
        ...state,
        deviceList: action.payload,
      };
    },
    gasFlow(state, action) {
      return {
        ...state,
        gasFlow: action.payload,
      };
    },
  },
};
