import React from 'react'
import path from 'path'
import Bundle from '../components/LazyLoad'
import HomeData from '../pages/Home/dispatch'

const createComponent = component => () => {
  return (
    <Bundle load={component}>
      { Component => Component ? <Component /> : <div>Loading...</div> }
    </Bundle>
  )
}

export default [
  {
    path: '/m',
    exact: true,
    component: (() => typeof __SERVER__ === 'undefined'
      ? createComponent(require('bundle-loader?lazy&name=home!pages/Home'))
      : null)(),
    componentPath: 'pages/Home', // for server render
    initData: HomeData,
    routes: [
      {
        path: 'my',
        exact: true,
        component: (() => typeof __SERVER__ === 'undefined'
          ? createComponent(require('bundle-loader?lazy&name=my!../pages/My'))
          : null)(),
        componentPath: 'pages/My' // for server render
      }
    ]
  }
]