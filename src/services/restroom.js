import { stringify } from 'qs';
import request from '@/utils/request';

export async function addRestRoom(params) {
  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('ip', params.ip);
  formData.append('region', params.region);
  formData.append('address', params.address);
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

export async function deleteRestRoom(params) {
  return request(`/api/v1/restroom/${params.restRoomId}`,{
    method: 'DELETE',
    headers:{
      authorization: sessionStorage.getItem("token"),
    },
  });
}

export async function updateRestRoom(params) {
  return request(`/api/v1/restroom/${params.restRoomId}`,{
    method: 'PATCH',
    body:stringify(params),
    headers:{
      authorization: sessionStorage.getItem("token"),
      'Content-Type':'application/x-www-form-urlencoded',
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


