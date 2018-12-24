export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/video-list' },
      {
        path: '/video-list',
        name: 'video-list',
        icon: 'video-camera',
        component: './Camera/Index',
      },
      {
        path: '/restroom',
        name: 'restroom',
        icon: 'home',
        component: './RestRoom/TableList',
      },
      {
        path: '/message',
        name: 'message',
        icon: 'notification',
        component: './RestRoom/TableList',
      },
      {
        path: '/user-manage',
        name: 'user-manage',
        icon: 'user',
        component: './Member/Index',
      },
      {
        component: '404',
      },
    ],
  },
];
