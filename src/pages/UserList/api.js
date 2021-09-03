// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function sysUserList(params, options) {
  return request('/api/sysUser/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 角色详情
export async function getUserDetail(options) {
  return request(`/api/sysUser/user/${options}`, {
    method: 'GET',
  });
}

// 菜单增加
export async function addUser(body, options) {
  return request('/api/sysUser/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataUser(body, options) {
  return request('/api/sysUser/user', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getRule(params, options) {
  return request('/api/sysRole/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return request(`/api/sysUser/user/${options}`, {
    method: 'DELETE',
  });
}

// 获取岗位列表
export async function getSysPost(params, options) {
  return request('/api/sysPost/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
