import path from 'path'
import Home, { initServerData } from '../pages/Home'
import My from '../pages/My'
import Error404 from '../pages/Error/404'

export default [
  {
    path: '/m',
    exact: true,
    component: Home,
    initData: initServerData,
    routes: [
      {
        path: 'my',
        exact: true,
        component: My
      }
    ]
  }
]