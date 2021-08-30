export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: '授权管理',
    icon: 'crown',
    // access: 'canAdmin',
    // component: './TableList',
    routes: [
      {
        path: '/admin/role',
        name: '角色管理',
        icon: 'smile',
        component: './TableList',
      },
      {
        path: '/admin/account',
        name: '账号管理',
        icon: 'smile',
        component: './TableList',
      },
      {
        path: '/admin/menu',
        name: '菜单管理',
        icon: 'smile',
        component: './TableList',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: '菜单管理',
    icon: 'CodepenOutlined',
    path: '/test',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
