// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function getList(params, options) {
  return request('/api/userMonitor/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function forceLogout(body, options) {
  return request(`/api/userMonitor/forceLogout/${body}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: null,
    ...(options || {}),
  });
}
