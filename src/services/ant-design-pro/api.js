// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function currentUser(options) {
  return request('/api/getUserInfo', {
    method: 'get',
    ...(options || {}),
  });
}
/** 退出登录接口 POST /api/login/outLogin */

export async function outLogin(options) {
  return request('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return request('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 此处后端没有提供注释 GET /api/notices */

export async function getNotices(options) {
  return request('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

//  ------------------------------------------------------------------------------------------------

/** 新建规则 PUT /api/rule */
export async function addRule(body, options) {
  return request('/api/sysRole/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataRule(body, options) {
  return request('/api/sysRole/role', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(options) {
  return request(`/api/sysRole/role/${options}`, {
    method: 'DELETE',
  });
}
// 角色
export async function getRule(params, options) {
  return request('/api/sysRole/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
// 角色详情
export async function getRuleDetail(options) {
  return request(`/api/sysRole/role/${options}`, {
    method: 'GET',
  });
}

// 菜单
export async function getMenu(params, options) {
  return request('/api/sysMenu/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
// 用户列表
export async function sysUserList(params, options) {
  return request('/api/sysUser/list', {
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

// 菜单树
export async function meunTree(params, options) {
  return request('/api/sysMenu/meunTree', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
