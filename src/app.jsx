import { PageLoading } from '@ant-design/pro-layout';
import { history } from 'umi';

import React from 'react';
import { notification } from 'antd';
import * as Icon from '@ant-design/icons';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { extend } from 'umi-request';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
// import { smile, HeartOutlined } from '@ant-design/icons';
import Local from '@/utils/local';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';

const fixMenuItemIcon = menus => {
  menus.forEach(item => {
    const { icon, children } = item;
    const iconType = 'Outlined';
    if (typeof icon === 'string') {
      const fixIconName = icon.slice(0, 1).toLocaleUpperCase() + icon.slice(1) + iconType;
      item.icon = React.createElement(Icon[fixIconName] || Icon[icon]);
    }
    // eslint-disable-next-line no-unused-expressions
    children && children.length > 0 ? (item.children = fixMenuItemIcon(children)) : null;
  });
  return menus;
};

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          // <Link to="/umi/plugin/openapi" target="_blank">
          //   <LinkOutlined />
          //   <span>OpenAPI 文档</span>
          // </Link>,
          // <Link to="/~docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    menuDataRender: () => {
      const menu = Local.get('menuData') || [];
      const newMenu = fixMenuItemIcon(menu);
      return newMenu;
    },
    ...initialState?.settings,
  };
};

const request = extend({
  credentials: 'include', // 默认请求是否带上cookie
});

// 请求拦截
request.interceptors.request.use(async (url, options) => {
  const headers = {};
  headers.Authorization = `Bearer 123`;
  return {
    url,
    options: { ...options, headers },
  };
});

// 返回拦截
request.interceptors.response.use(async res => {
  const response = await res.clone();
  const codeMaps = {
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
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
    // 跳转登录
    Local.clear();
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
