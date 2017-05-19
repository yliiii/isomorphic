import React from 'react'
import path from 'path'
import { Route } from 'react-router-dom'
import Bundle from 'components/LazyLoad'

let autoKey = 0

export function routerParse(config, routerPath) {
  if (!routerPath) autoKey = 0
  if (!config || !config.length) return

  let routerArray = []

  config.forEach(function(routerConfig) {
    const { routes, ...routerProp } = routerConfig

    if (routerPath) {
      routerProp.path = path.join(routerPath, routerProp.path)
    }

    routerArray.push(
      <Route {...routerProp} key={`${autoKey}_${new Date().getTime()}`} />
    )

    autoKey++

    if (routes) {
      routerParse(routes, routerProp.path).forEach(router => routerArray.push(router))
    }
  })

  return routerArray
}

export const createAsyncComponent = component => () => (
  <Bundle load={component}>
    { Component => Component ? <Component /> : null }
  </Bundle>
)