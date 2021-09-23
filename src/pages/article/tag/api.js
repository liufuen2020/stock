// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function getList(params, options) {
  return request('/api/cmsTags/page', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 树形类表
export async function cmsCategoryTree(params, options) {
  return request(`/api/cmsSite/tree`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 增加
export async function addField(body, options) {
  return request('/api/cmsTags/tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataField(body, options) {
  return request('/api/cmsTags/tag', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除  */

export async function removeField(options) {
  return request(`/api/cmsTags/tag/${options}`, {
    method: 'DELETE',
  });
}
