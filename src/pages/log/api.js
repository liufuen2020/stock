// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

// 列表
export async function getList(params, options) {
  return request('/api/sysOperationLog/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

// 详情
export async function getDetail(options) {
  return request(`/api/sysOperationLog/log/${options}`, {
    method: 'GET',
  });
}
