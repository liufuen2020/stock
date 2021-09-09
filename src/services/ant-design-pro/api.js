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
  return request('/api/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/**验证码 */
// 角色
export async function getCaptcha(params, options) {
  return request('/api/captcha', {
    method: 'GET',
    params: { ...params },
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
  return request('/api/sysRole/page', {
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

// 菜单树
export async function meunTree(params, options) {
  return request('/api/sysMenu/meunTree', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 当前用户 路由
export async function routes(params, options) {
  return request('/api/routes', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

//  行政区域

export async function asynchTree(params, options) {
  return request('/api/sysBranch/asynchTree', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
