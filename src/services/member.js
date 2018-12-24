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
  return request(`/api/v1/user/${params.userId}`,{
    method: 'DELETE',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function resetPass(params) {
  return request(`/api/v1/password`,{
    method: 'PATCH',
    body:stringify(params),
    headers:{
      authorization: sessionStorage.getItem("token"),
      'Content-Type':'application/x-www-form-urlencoded',
    },
  });
}


export async function add(params) {
  const formData = new FormData();
  formData.append('username', params.username);
  formData.append('password', params.password);
  formData.append('level', params.level);
  formData.append('department', params.department);
  formData.append('relName', params.relName);
  formData.append('userStatus', params.userStatus);
  return request(`/api/v1/user`,{
    method: 'POST',
    body:formData,
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function query(params) {
  console.log('queryUserList');
  console.log(params);
  // openNotification('we',params);
  return request(`/api/v1/user?${stringify(params)}`,{
    method: 'GET',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}



