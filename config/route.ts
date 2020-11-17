export default [
  {
    path: '/',
    menu: {
      flatMenu: true,
    },
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/home',
        name: 'home',
        icon: 'smile',
        component: './home',
      },
      {
        component: './404'
      }
    ]
  },
  {
    component: './404'
  }
]