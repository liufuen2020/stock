/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getDvaApp } from 'umi';
import local from './local';

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
});

// 请求拦截
request.interceptors.request.use(async (url, options) => {
  const headers = {};
  const year = local.get('year');
  if (['post', 'put', 'delete'].indexOf(options.method) > -1) {
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json; charset=utf-8';
      if (options.body && !options.body.year) {
        options.body.year = year;
      } else if (options.data && !options.data.year) {
        options.data.year = year;
      }

      options.body = JSON.stringify(options.body);
    }
  }

  if (options.method === 'get' && options.params && !options.params.year) {
    options.params.year = year;
  }
  const zkpToken = local.get('zkp_token');
  const zkpCardType = local.get('cardType');

  if (zkpToken) {
    headers.Authorization = `Bearer ${zkpToken.accessToken}`;
  }
  if (zkpCardType) {
    headers.cardType = `${zkpCardType}`;
  }

  let apiUrl = '';
  if (url.indexOf('/yuedu/') > -1 || url.indexOf('/yuedu-zkp/') > -1) {
    apiUrl = url;
  } else if (url.indexOf(`${process.env.API_PREFIX_ADMIN}`) > -1) {
    apiUrl = url;
  } else {
    apiUrl = `${process.env.API_PREFIX}${url}`;
  }

  return {
    url: apiUrl,
    options: { ...options, headers },
  };
});

// 返回拦截
request.interceptors.response.use(async res => {
  const response = await res.clone();
  const codeMaps = {
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    // 401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };

  if (response.status === 401) {
    // notification.close();
    // notification.error({
    //   message: response.message || '未登录或登录已过期，请重新登录。',
    //   duration: 3000,
    // });
    const { _store } = getDvaApp();
    // 跳转登录
    _store.dispatch({
      type: 'login/logout',
      payload: {},
    });
    local.clear();
    return false;
  }

  if (codeMaps[response.status]) {
    notification.error({
      message: `请求错误 ${response.status}`,
      description: codeMaps[response.status],
    });
    return false;
  }
  return response;
});

export default request;
