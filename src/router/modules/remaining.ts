const routes = [
  {
    path: '/login',
    name: RouteName.login,
    component: () => import('@/views/auth/LoginView.vue')
  }
]

export default routes
