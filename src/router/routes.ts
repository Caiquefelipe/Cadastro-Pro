import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'ListagemCliente',
    component: () => import('components/ListagemCliente.vue'),
  },
]

export default routes
