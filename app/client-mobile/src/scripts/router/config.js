import { createAsyncComponent } from 'router'

export default [
  {
    path: '/m',
    exact: true,
    component: (() => typeof __SERVER__ === 'undefined'
      ? createAsyncComponent(require('bundle-loader?lazy&name=home!pages/Home'))
      : undefined)(),
    componentPath: 'pages/Home', // for server render
    initData: (() => typeof __SERVER__ === 'undefined'
      ? undefined
      : require('pages/Home/dispatch').default)(),
    routes: [
      {
        path: 'my',
        exact: true,
        component: (() => typeof __SERVER__ === 'undefined'
          ? createAsyncComponent(require('bundle-loader?lazy&name=my!pages/My'))
          : undefined)(),
        componentPath: 'pages/My', // for server render
        initData: (() => typeof __SERVER__ === 'undefined'
          ? undefined
          : require('pages/My/dispatch').default)(),
      }
    ]
  }
]