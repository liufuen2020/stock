// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function getList(params, options) {
  return request('/api/sysPerson/person', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 详情
export async function getDetail(options) {
  return request(`/api/sysPost/post/${options}`, {
    method: 'GET',
  });
}

// 增加
export async function addField(body, options) {
  return request('/api/sysPost/post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataField(body, options) {
  return request('/api/sysPerson/person', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataPassword(body, options) {
  return request('/api/sysPerson/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function addAvator(body, options) {
  return request('/api/sysPerson/avator', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
