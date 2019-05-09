import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * @RequestParam(value = "restRoomId") Integer restRoomId,
 @RequestParam(value = "ip") String ip,
 @RequestParam(value = "username") String username,
 @RequestParam(value = "password") String password,
 @RequestParam(value = "remark",required = false) String remark,
 @RequestParam(value = "status",defaultValue = "1") Integer status
 */

export async function del(params) {
  return request(`/api/v1/device/gas/${params.gasDeviceId}`,{
    method: 'DELETE',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function add(params) {
  const formData = new FormData();
  formData.append('restRoomId', params.restRoomId);
  formData.append('gasDeviceId', params.gasDeviceId);
  formData.append('gasDeviceParentId', params.gasDeviceParentId);
  formData.append('status', params.status);
  formData.append('type', params.type);
  return request(`/api/v1/device/gas`,{
    method: 'POST',
    body:formData,
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function query(params) {
  return request(`/api/v1/device/gas/${params.restRoomId}?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function queryHomeGasList(params) {
  return request(`/api/v1/device/gas-home/list/${params.restRoomId}?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function queryGasInfo(params) {
  return request(`/api/v1/device/gas/list/${params.restRoomId}?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}
