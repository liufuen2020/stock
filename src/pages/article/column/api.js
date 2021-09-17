// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function getList(params, options) {
  return request('/api/cmsColumn/page', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 详情
export async function cmsCategoryTree(params, options) {
  return request(`/api/cmsColumn/tree`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 增加
export async function addField(body, options) {
  return request('/api/cmsColumn/column', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataField(body, options) {
  return request('/api/cmsColumn/column', {
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
  return request(`/api/cmsColumn/column/${options}`, {
    method: 'DELETE',
  });
}
