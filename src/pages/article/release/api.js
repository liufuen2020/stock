// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 用户列表
export async function getList(params, options) {
  return request('/api/cmsArticle/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 详情
export async function getDetail(options) {
  return request(`/api/cmsArticle/article/${options}`, {
    method: 'GET',
  });
}
// 增加
export async function addField(body, options) {
  return request('/api/cmsArticle/article', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function upadataField(body, options) {
  return request('/api/cmsArticle/article', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function audit(body, options) {
  return request('/api/cmsArticle/audit', {
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
  return request(`/api/cmsArticle/article/${options}`, {
    method: 'DELETE',
  });
}

/** tagList */

export async function tagList(params, options) {
  return request('/api/cmsTags/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 通过站点获取栏目 /cmsColumn/columnTree/

// 详情
export async function columnTree(options) {
  return request(`/api/cmsColumn/columnTree/${options}`, {
    method: 'GET',
  });
}
