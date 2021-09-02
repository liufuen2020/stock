// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

// 菜单
export async function getMenu(params, options) {
  return request('/api/sysMenu/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 菜单增加
export async function addMenu(body, options) {
  return request('/api/sysMenu/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function removeMenu(options) {
  return request(`/api/sysMenu/menu/${options}`, {
    method: 'DELETE',
  });
}
