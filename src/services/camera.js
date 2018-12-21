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

export async function addCamera(params) {
  const formData = new FormData();
  formData.append('restRoomId', params.restRoomId);
  formData.append('username', params.username);
  formData.append('password', params.password);
  formData.append('remark', params.remark);
  formData.append('status', params.status);
  if(params.cleaner!==undefined) formData.append('cleaner', params.cleaner);
  if(params.remark!==undefined) formData.append('remark', params.remark);
  return request(`/api/v1/restroom`,{
    method: 'POST',
    body:formData,
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function query(params) {
  return request(`/api/v1/restroom?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}


