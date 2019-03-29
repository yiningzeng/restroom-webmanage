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
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        icon: 'video-camera',
        component: './Home/Index',
      },
      {
        path: '/camera-list',
        name: 'video-list',
        icon: 'video-camera',
        component: './Camera/Index',
      },
      {
        path: '/restroom',
        name: 'restroom',
        icon: 'home',
        component: './RestRoom/Index',
      },
      {
        path: '/message',
        name: 'message',
        icon: 'notification',
        component: './RestRoom/Index',
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
