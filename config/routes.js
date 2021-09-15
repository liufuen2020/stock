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
    hidden: true,
    // access: 'canAdmin',
    // component: './TableList',
    routes: [
      {
        path: '/admin/role',
        name: '角色管理',
        icon: 'smile',
        component: './RoleList',
      },
      {
        path: '/admin/account',
        name: '账号管理',
        icon: 'smile',
        component: './UserList',
      },
      {
        path: '/admin/menu',
        name: '菜单管理',
        icon: 'smile',
        hidden: true,
        component: './MenuList',
      },
      {
        path: '/admin/sysPost',
        name: '岗位管理',
        icon: 'smile',
        component: './sysPost',
      },
      {
        path: '/admin/dept',
        name: '部门管理',
        icon: 'smile',
        component: './dept',
      },
      {
        path: '/admin/dict',
        name: '字典管理',
        icon: 'smile',
        component: './DictData',
      },
      {
        path: '/admin/log',
        name: '日志管理',
        icon: 'smile',
        component: './log',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/account/settings',
    component: './settings',
  },
  {
    path: '/system',
    name: '监控管理',
    routes: [
      {
        path: '/system/online',
        name: '用户监控',
        icon: 'smile',
        component: './system/online',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/admin/role',
  },
  {
    component: './404',
  },
];
