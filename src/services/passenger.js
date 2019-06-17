import { stringify } from 'qs';
import request from '@/utils/request';

export async function onlyGetFuckFlow(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/only-get-fuck-flow`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function getOnlyFuckFlowByWeek(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/week`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function getOnlyFuckFlowByMonth(params) {
  return request(`/api/v1/restroom/${params.restRoomId}/month`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}
