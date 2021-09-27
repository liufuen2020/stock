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
    path: '/system',
    name: '授权管理',
    icon: 'crown',
    hidden: true,
    // access: 'canAdmin',
    // component: './TableList',
    routes: [
      {
        path: '/system/role',
        name: '角色管理',
        icon: 'smile',
        component: './RoleList',
      },
      {
        path: '/system/user',
        name: '账号管理',
        icon: 'smile',
        component: './UserList',
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        icon: 'smile',
        hidden: true,
        component: './MenuList',
      },
      {
        path: '/system/post',
        name: '岗位管理',
        icon: 'smile',
        component: './sysPost',
      },
      {
        path: '/system/dept',
        name: '部门管理',
        icon: 'smile',
        component: './dept',
      },
      {
        path: '/system/dict',
        name: '字典管理',
        icon: 'smile',
        component: './DictData',
      },
      {
        path: '/system/log',
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
    path: '/monitor',
    name: '监控管理',
    routes: [
      {
        path: '/monitor/online',
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
    path: '/article',
    name: '文章管理',
    routes: [
      {
        path: '/article/release',
        name: '文章发布',
        icon: 'smile',
        component: './article/release',
      },
      {
        path: '/article/category',
        name: '类别管理',
        icon: 'smile',
        component: './article/category',
      },
      {
        path: '/article/column',
        name: '栏目管理',
        icon: 'smile',
        component: './article/column',
      },
      {
        path: '/article/site',
        name: '站点管理',
        icon: 'smile',
        component: './article/site',
      },
      {
        path: '/article/tag',
        name: '标签管理',
        icon: 'smile',
        component: './article/tag',
      },
      {
        path: '/article/batchSaveWords',
        name: '敏感词',
        icon: 'smile',
        component: './article/batchSaveWords',
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
