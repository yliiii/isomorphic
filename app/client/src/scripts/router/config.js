import { createAsyncComponent } from 'router'

export default [
  {
    path: '/m',
    exact: true,
    component: typeof __SERVER__ === 'undefined'
      ? createAsyncComponent(require('bundle-loader?lazy&name=home!pages/Home'))
      : import('pages/Home'),
    initData: import('pages/Home/dispatch'),
    routes: [
      {
        path: 'my',
        exact: true,
        component: typeof __SERVER__ === 'undefined'
        ? createAsyncComponent(require('bundle-loader?lazy&name=my!pages/My'))
        : import('pages/My'),
        initData: import('pages/My/dispatch'),
      }
    ]
  }
]