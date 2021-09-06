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
        component: './MenuList',
      },
      {
        path: '/admin/sysPost',
        name: '岗位管理',
        icon: 'smile',
        component: './sysPost',
      },
      {
        component: './404',
      },
    ],
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
