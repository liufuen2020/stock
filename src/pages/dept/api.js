// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

// 菜单
export async function getList(params, options) {
  return request('/api/sysDept/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 详情
export async function getDetail(options) {
  return request(`/api/sysDept/dept/${options}`, {
    method: 'GET',
  });
}
// 增加
export async function addField(body, options) {
  return request('/api/sysDept/dept', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataField(body, options) {
  return request('/api/sysDept/dept', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function removeMenu(options) {
  return request(`/api/sysDept/dept/${options}`, {
    method: 'DELETE',
  });
}
