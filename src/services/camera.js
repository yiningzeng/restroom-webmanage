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
  return request(`/api/v1/device/camera/${params.cameraId}`,{
    method: 'DELETE',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function add(params) {
  const formData = new FormData();
  formData.append('restRoomId', params.restRoomId);
  formData.append('username', params.username);
  formData.append('password', params.password);
  formData.append('status', params.status);
  if(params.ip!==undefined) formData.append('ip', params.ip.replace("：",":"));
  if(params.remark!==undefined) formData.append('remark', params.remark);
  return request(`/api/v1/device/camera`,{
    method: 'POST',
    body:formData,
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function query(params) {
  return request(`/api/v1/device/camera/${params.restRoomId}?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function push(params) {
  return request(`/api/v1/stream/push/${params.cameraId}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}
export async function stop(params) {
  return request(`/api/v1/stream/stop/${params.cameraId}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}


