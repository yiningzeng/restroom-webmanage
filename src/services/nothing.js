import { stringify } from 'qs';
import request from '@/utils/request';

export async function statistic(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/statistic?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function getList(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/statistic-with-day?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function getFuckGasInfo(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/only-get-gas-device-info`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}
