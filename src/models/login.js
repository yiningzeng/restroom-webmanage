import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'login',

  state: {
    result: {
      code: 0,
      status: undefined,
      msg: '',
      data: {
        token: undefined,
        userId: undefined,
        userNumber: undefined,
        relName: undefined,
        userHeadUrl: undefined,
        department: undefined,
        userType: undefined,
        createTime: undefined,
        level: {
          levelName: undefined,
          remark: undefined,
          status: undefined,
        },
      },
    },
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response.status === 0) {
        reloadAuthorized();
        console.log('结果',response);// { pathname: `${url}`, state: { nodeType: nodeType }}
        sessionStorage.setItem("username",payload.username);
        sessionStorage.setItem("password",payload.password);
        sessionStorage.setItem("token",response.data.token);

        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
        yield put(routerRedux.push('/restroom/restroom-manage'));
      }
      else if(payload.refresh === true){
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();

        yield put(routerRedux.push('/user/login'));
      }


      // // Login successfully
      // if (response.status === 'ok') {
      //   reloadAuthorized();
      //   const urlParams = new URL(window.location.href);
      //   const params = getPageQuery();
      //   let { redirect } = params;
      //   if (redirect) {
      //     const redirectUrlParams = new URL(redirect);
      //     if (redirectUrlParams.origin === urlParams.origin) {
      //       redirect = redirect.substr(urlParams.origin.length);
      //       if (redirect.match(/^\/.*#/)) {
      //         redirect = redirect.substr(redirect.indexOf('#') + 1);
      //       }
      //     } else {
      //       window.location.href = redirect;
      //       return;
      //     }
      //   }
      //   yield put(routerRedux.replace(redirect || '/'));
      // }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if(payload.data.userStatus === 1){
        setAuthority("admin");
        return {
          ...state,
          result: payload,
          type:'account',
        };
      }
      else{
        setAuthority("guest");
        return {
          ...state,
          result: payload,
          type: 'account',
        };
  }
    },
  },
};
